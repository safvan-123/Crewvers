"""Audit the static export; optionally compare against the original project ZIP.
Run after npm run build: python3 scripts/verify-upgrade.py [original.zip]
Uses Python's standard library only. Does not replace browser interaction tests.
"""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'out'
PAGES = ['index.html', 'about/index.html', 'services/index.html',
         'events/index.html', 'contact/index.html']

class Document(HTMLParser):
    def __init__(self, data):
        super().__init__(convert_charrefs=True)
        self.text, self.images, self.metadata, self.links, self.assets = [], [], [], [], []
        self.ids, self.duplicates = set(), []
        self.skip = 0
        self.feed(data)
    def handle_starttag(self, tag, pairs):
        attrs = dict(pairs)
        if tag in ('script', 'style'): self.skip += 1
        if attrs.get('id'):
            if attrs['id'] in self.ids: self.duplicates.append(attrs['id'])
            self.ids.add(attrs['id'])
        if tag == 'img': self.images.append(tuple(attrs.get(x) for x in ('src', 'alt', 'width', 'height', 'sizes', 'srcset')))
        if tag == 'meta': self.metadata.append(sorted(pairs))
        if tag == 'a': self.links.append(attrs.get('href', ''))
        if tag in ('img', 'script') and attrs.get('src'): self.assets.append(attrs['src'])
        if tag == 'link' and attrs.get('href') and attrs.get('rel') in ('stylesheet', 'preload', 'modulepreload', 'icon', 'shortcut icon', 'apple-touch-icon'): self.assets.append(attrs['href'])
    def handle_endtag(self, tag):
        if tag in ('script', 'style'): self.skip -= 1
    def handle_data(self, data):
        if not self.skip: self.text.extend(data.split())

docs = {str(p.relative_to(OUT)): Document(p.read_text()) for p in OUT.rglob('*.html')}
assert all(page in docs for page in PAGES), 'Required route missing'
assert 'contact' in docs['index.html'].ids
assert all('enquiry-form' in docs[page].ids for page in ('index.html', 'contact/index.html'))
for page, doc in docs.items():
    assert not doc.duplicates, (page, 'duplicate IDs', doc.duplicates)
    for href in doc.links + doc.assets:
        parsed = urlsplit(href)
        if parsed.scheme or parsed.netloc or not parsed.path.startswith('/'):
            if not parsed.path and parsed.fragment: assert unquote(parsed.fragment) in doc.ids, (page, href)
            continue
        target = OUT / unquote(parsed.path).lstrip('/')
        if target.is_dir(): target /= 'index.html'
        assert target.exists(), (page, 'missing local target', href)
        if parsed.fragment:
            target_doc = docs.get(str(target.relative_to(OUT)))
            assert target_doc and unquote(parsed.fragment) in target_doc.ids, (page, 'missing anchor', href)
print(f'PASS: {len(docs)} exported HTML documents; local links, assets, anchors and unique IDs')
home = docs['index.html'].links
assert '#contact' in home and '#enquiry-form' in home
for page in PAGES[1:]:
    assert '/contact/' in docs[page].links and '/contact/#enquiry-form' in docs[page].links
assert all('/events/' in docs[page].links for page in PAGES)
print('PASS: hybrid Contact/Get a Crew destinations and dedicated Events navbar links')

if len(sys.argv) > 1:
    with zipfile.ZipFile(sys.argv[1]) as original:
        prefix = next(name[:-len('app/globals.css')] for name in original.namelist() if name.endswith('/app/globals.css'))
        for page in PAGES:
            before = Document(original.read(prefix + 'out/' + page).decode())
            after = docs[page]
            assert before.text == after.text, (page, 'visible text changed')
            assert before.images == after.images, (page, 'image attributes changed')
            assert before.metadata == after.metadata, (page, 'metadata changed')
        assets = [name for name in original.namelist() if name.startswith(prefix + 'public/') and not name.endswith('/')]
        for name in assets:
            if name.endswith(('/images/logo.webp', '/favicon.svg')): continue  # Intentional lossless encoding upgrade.
            assert original.read(name) == (ROOT / name[len(prefix):]).read_bytes(), ('asset changed', name)
        for name in original.namelist():
            if name.startswith(prefix + 'lib/') and not name.endswith('/') and not name.endswith('/lib/cms.ts'):
                assert original.read(name) == (ROOT / name[len(prefix):]).read_bytes(), ('unchanged business/API/SEO logic changed', name)
        # The original CSS is retained verbatim; enhancements are appended only.
        assert (ROOT / 'app/globals.css').read_bytes().startswith(original.read(prefix + 'app/globals.css'))
        before_form = original.read(prefix + 'components/ContactForm.tsx').decode()
        after_form = (ROOT / 'components/ContactForm.tsx').read_text().replace('id="enquiry-form" ', '')
        assert before_form == after_form, 'Form changed beyond its anchor ID'
        assert original.read(prefix + 'package.json') == (ROOT / 'package.json').read_bytes()
        assert original.read(prefix + 'package-lock.json') == (ROOT / 'package-lock.json').read_bytes()
        print(f'PASS: five primary pages have identical visible text, image attributes and metadata; {len(assets)-2} original public assets byte-identical; logo.webp/favicon.svg intentionally updated from supplied logo')
        print('PASS: original business/SEO logic (except intentional CMS extension), form behavior, original CSS, dependencies and lockfile preserved')
