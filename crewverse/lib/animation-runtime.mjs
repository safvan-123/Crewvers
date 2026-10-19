const easing = 'cubic-bezier(.22,1,.36,1)';
const targets = '[data-reveal], .section-heading, .about-banner, .industry-photo, .industry-list > div, .event-card, .event-cover, .empty-events, .event-detail-cover, .contact-sidebar, .contact-form, .home-contact-grid > div, .cta-layout';

/** DOM-only progressive enhancement, isolated for lifecycle/mobile regression tests. */
export function startAnimations(main, scope = document, env = window) {
  const preference = env.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = env.matchMedia('(max-width: 768px), (pointer: coarse)');
  const precise = env.matchMedia('(hover: hover) and (pointer: fine)');
  const animations = new Set(), cleanup = [], seen = new WeakSet(), magnetic = new WeakSet();
  const pressed = new Map(), heroNodes = new WeakSet(), imageNodes = new WeakSet();
  let disposed = false, frame = 0;
  function listen(element, type, fn, options) {
    element.addEventListener(type, fn, options);
    cleanup.push(() => element.removeEventListener(type, fn, options));
  }
  function play(element, frames, duration = 600, delay = 0) {
    if (!element || disposed || preference.matches) return;
    if (typeof element.animate !== 'function') {
      // Older WebViews still get a lightweight CSS entrance; content stays visible.
      if (!element.classList.contains('motion-fallback-reveal')) {
        element.classList.add('motion-fallback-reveal');
        cleanup.push(() => element.classList.remove('motion-fallback-reveal'));
      }
      return;
    }
    try {
      const animation = element.animate(frames, {duration, delay, easing, fill: 'backwards'});
      animations.add(animation);
      animation.onfinish = animation.oncancel = () => animations.delete(animation);
      return animation;
    } catch {
      // Some mobile WebViews support animate() but not every animated property.
      element.classList.add('motion-fallback-reveal');
      cleanup.push(() => element.classList.remove('motion-fallback-reveal'));
    }
  }
  function fade(element, delay = 0) {
    const distance = mobile.matches ? 24 : 20;
    return play(element, [
      {opacity: mobile.matches ? .16 : .4, transform: `translateY(${distance}px)`},
      {opacity: 1, transform: 'translateY(0)'},
    ], mobile.matches ? 650 : 600, Math.min(delay, mobile.matches ? 160 : 180));
  }
  function whenImageReady(image, callback) {
    if (!image) return;
    if (image.complete && image.naturalWidth > 0) callback();
    else listen(image, 'load', () => {if (!disposed) callback();}, {once: true});
  }
  function revealImage(image, frames, duration) {
    if (!image || imageNodes.has(image)) return;
    imageNodes.add(image);
    whenImageReady(image, () => play(image, frames, duration));
  }
  function reveal(element) {
    if (disposed || seen.has(element)) return;
    seen.add(element);
    fade(element, Number(element.dataset.revealDelay || 0) * 1000);
    if (element.matches('.section-heading')) {
      element.querySelectorAll('h2, .section-description, .compact-intro').forEach((child, i) => fade(child, i * 80));
    }
    if (element.matches('.about-photo, .about-banner, .service-detail-photo, .event-cover, .event-detail-cover, .industry-photo')) {
      revealImage(element.querySelector('img'), [
        {opacity: .7, transform: 'scale(1.04)'}, {opacity: 1, transform: 'scale(1)'},
      ], 800);
    }
    // On phones there is no hover: give each existing card one image/brand reveal.
    const card = element.matches('.reference-service-card, .event-card') ? element : element.querySelector('.reference-service-card');
    if (mobile.matches && card) {
      revealImage(card.querySelector('img'), [
        {transform: 'scale(1.055)'}, {transform: 'scale(1)'},
      ], 850);
      const border = env.getComputedStyle(card).borderColor;
      play(card, [{borderColor: border}, {borderColor: '#ffcc32', offset: .4}, {borderColor: border}], 850);
      const arrow = card.querySelector('.card-corner');
      if (arrow) play(arrow, [{transform: 'translate(0,0)'}, {transform: 'translate(3px,-3px)', offset: .5}, {transform: 'translate(0,0)'}], 650);
    }
  }
  const observer = typeof env.IntersectionObserver === 'function' ? new env.IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      reveal(entry.target);
    }
  }, {threshold: 0, rootMargin: '0px 0px -24px 0px'}) : null;
  const observed = new WeakSet();
  const steps = new Set();
  const timeline = typeof env.IntersectionObserver === 'function' ? new env.IntersectionObserver(entries => {
    for (const entry of entries) {
      entry.target.style.setProperty('--step-progress', String(entry.intersectionRatio));
      if (entry.isIntersecting) steps.forEach(step => step.toggleAttribute('data-step-active', step === entry.target));
    }
  }, {rootMargin: '-10% 0px -20% 0px', threshold: Array.from({length: 21}, (_, i) => i / 20)}) : null;
  function scan() {
    frame = 0;
    if (disposed) return;
    const hero = main.querySelector('.hero');
    if (hero) {
      ['.hero-eyebrow', 'h1', '.reference-tagline', '.hero-details > p', '.hero-actions'].forEach((selector, i) => {
        const part = hero.querySelector(selector);
        if (part && !heroNodes.has(part)) {heroNodes.add(part); fade(part, i * (mobile.matches ? 75 : 90));}
      });
      // Scale/fade work consistently on iOS and Android without text clipping masks.
      revealImage(hero.querySelector('.hero-photo'), [
        {transform: 'scale(1.04)'}, {transform: 'scale(1)'},
      ], 1200);
    }
    main.querySelectorAll(targets).forEach(element => {
      if (element.closest('.hero') || observed.has(element)) return;
      if (!element.matches('[data-reveal]') && element.parentElement?.closest('[data-reveal]')) return;
      observed.add(element);
      if (observer) observer.observe(element); else reveal(element);
    });
    main.querySelectorAll('.process-step').forEach(step => {
      if (steps.has(step)) return;
      steps.add(step);
      timeline?.observe(step);
    });
    scope.querySelectorAll('[data-magnetic]').forEach(button => {
      if (magnetic.has(button)) return;
      magnetic.add(button);
      const reset = () => {button.style.removeProperty('--magnetic-x'); button.style.removeProperty('--magnetic-y');};
      listen(button, 'pointermove', event => {
        if (!precise.matches || preference.matches || event.pointerType === 'touch') return;
        const rect = button.getBoundingClientRect();
        button.style.setProperty('--magnetic-x', `${Math.max(-3, Math.min(3, (event.clientX - rect.left - rect.width / 2) * .05))}px`);
        button.style.setProperty('--magnetic-y', `${Math.max(-3, Math.min(3, (event.clientY - rect.top - rect.height / 2) * .08))}px`);
      }, {passive: true});
      listen(button, 'pointerleave', reset); listen(button, 'blur', reset); cleanup.push(reset);
    });
  }
  function scheduleScan() {
    if (!disposed && !frame) frame = env.requestAnimationFrame(scan);
  }
  const mutations = typeof env.MutationObserver === 'function' ? new env.MutationObserver(scheduleScan) : null;
  mutations?.observe(main, {childList: true, subtree: true});
  // Native clicks and scrolling are never delayed or prevented.
  listen(main, 'pointerdown', event => {
    if (event.pointerType !== 'touch' || preference.matches) return;
    const element = event.target?.closest?.('.reference-service-card, .event-cover, .event-card, .button, .mobile-booking, .text-link');
    if (!element) return;
    const animation = play(element, [{transform: 'scale(1)'}, {transform: 'scale(.975)'}], 140);
    pressed.set(event.pointerId, {element, animation});
  }, {passive: true});
  function release(event) {
    const press = pressed.get(event.pointerId);
    if (!press) return;
    press.animation?.cancel();
    pressed.delete(event.pointerId);
    play(press.element, [{transform: 'scale(.975)'}, {transform: 'scale(1)'}], 220);
  }
  listen(env, 'pointerup', release, {passive: true});
  listen(env, 'pointercancel', release, {passive: true});
  const stop = () => {
    if (preference.matches) {
      [...animations].forEach(animation => animation.cancel());
      pressed.clear();
    }
  };
  // Older Safari MediaQueryList uses addListener instead of addEventListener.
  if (typeof preference.addEventListener === 'function') listen(preference, 'change', stop);
  else if (typeof preference.addListener === 'function') {
    preference.addListener(stop); cleanup.push(() => preference.removeListener(stop));
  }
  listen(env, 'pageshow', scheduleScan);
  play(main, [{opacity: .72}, {opacity: 1}], 320);
  scheduleScan();
  return () => {
    disposed = true;
    if (frame) env.cancelAnimationFrame(frame);
    observer?.disconnect(); timeline?.disconnect(); mutations?.disconnect();
    [...animations].forEach(animation => animation.cancel());
    pressed.clear(); cleanup.forEach(dispose => dispose());
  };
}
