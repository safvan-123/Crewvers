import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const url = new URL('../lib/seo.ts',import.meta.url).href;
function run(origin) {
 const env = {...process.env};
 if (origin === undefined) delete env.NEXT_PUBLIC_SITE_URL; else env.NEXT_PUBLIC_SITE_URL=origin;
 return spawnSync(process.execPath,['--input-type=module','-e',`import {siteUrl,pageMetadata} from ${JSON.stringify(url)}; console.log(JSON.stringify({siteUrl,metadata:pageMetadata('Services','Description','/services/')}));`],{env,encoding:'utf8'});
}
test('production SEO keeps canonical, Open Graph and social image URLs on the real configured origin',()=>{
 const result=run('https://crewverse-seo-check.invalid');assert.equal(result.status,0,result.stderr);
 const {siteUrl,metadata}=JSON.parse(result.stdout);
 assert.equal(siteUrl,'https://crewverse-seo-check.invalid');
 assert.equal(metadata.alternates.canonical,siteUrl+'/services/');
 assert.equal(metadata.openGraph.url,siteUrl+'/services/');
 assert.equal(new URL(metadata.openGraph.images[0].url,siteUrl).href,siteUrl+'/images/concert.webp');
 assert.equal(new URL(metadata.twitter.images[0],siteUrl).href,siteUrl+'/images/concert.webp');
});
test('unconfigured development SEO does not invent a production canonical',()=>{
 const result=run();assert.equal(result.status,0,result.stderr);
 const {metadata}=JSON.parse(result.stdout);assert.equal(metadata.alternates,undefined);
});
test('SEO rejects an HTTP origin or a page URL used as the site origin',()=>{
 for(const origin of ['http://example.invalid','https://example.invalid/page','https://example.invalid/?query=1']){
  const result=run(origin);assert.notEqual(result.status,0);assert.match(result.stderr,/production origin/);
 }
});
