import test from 'node:test';
import assert from 'node:assert/strict';
import {startAnimations} from '../lib/animation-runtime.mjs';

class Target {
 listeners = new Map();
 addEventListener(type, fn) {if (!this.listeners.has(type)) this.listeners.set(type,new Set());this.listeners.get(type).add(fn);}
 removeEventListener(type, fn) {this.listeners.get(type)?.delete(fn);}
 emit(type, event = {}) {for(const fn of [...(this.listeners.get(type)||[])]) fn(event);}
}
class Element extends Target {
 constructor(tags = []) {super();this.tags=new Set(tags);}
 dataset = {}; queries = new Map(); records = []; nodes = []; parentElement = null;
 classes = new Set(); classList={contains:key=>this.classes.has(key),add:key=>this.classes.add(key),remove:key=>this.classes.delete(key)};
 values = new Map(); style={setProperty:(key,value)=>this.values.set(key,value),removeProperty:key=>this.values.delete(key)};
 matches(selector) {return selector.split(',').some(value=>this.tags.has(value.trim()));}
 closest(selector) {return this.matches(selector)?this:this.parentElement?.closest(selector)||null;}
 querySelector(selector) {return this.queries.get(selector)||null;}
 querySelectorAll(selector) {if(selector==='.process-step')return [];if(selector==='[data-magnetic]')return this.magnets||[];return this.nodes;}
 toggleAttribute() {}
 getBoundingClientRect() {return {left:0,top:0,width:100,height:50};}
 animate(frames, options) {const record={frames,options,cancel(){record.cancelled=true;record.oncancel?.();}};this.records.push(record);return record;}
}
function setup({reduced=false,mobile=true,observation=true,webAnimations=true}={}) {
 const env=new Target(), main=new Element(), scope=new Element(), io=[], mo=[], raf=new Map();let next=0;
 const reduce=Object.assign(new Target(),{matches:reduced});
 env.matchMedia=q=>q.includes('reduced-motion')?reduce:{matches:q.includes('pointer: fine')?!mobile:mobile};
 env.getComputedStyle=()=>({borderColor:'rgba(255,255,255,.14)'});
 env.requestAnimationFrame=fn=>{const id=++next;raf.set(id,fn);return id;};
 env.cancelAnimationFrame=id=>raf.delete(id);
 env.flush=()=>{for(const [id,fn] of [...raf]){raf.delete(id);fn();}};
 if(observation)env.IntersectionObserver=class {constructor(fn,options){this.fn=fn;this.options=options;this.elements=new Set();io.push(this);}observe(e){this.elements.add(e);}unobserve(e){this.elements.delete(e);}disconnect(){this.disconnected=true;}trigger(e){this.fn([{target:e,isIntersecting:true,intersectionRatio:.7}]);}};
 env.MutationObserver=class {constructor(fn){this.fn=fn;mo.push(this);}observe(){}disconnect(){this.disconnected=true;}};
 const card=new Element(['[data-reveal]']);if(!webAnimations)card.animate=undefined;
 main.nodes.push(card);
 const stop=startAnimations(main,scope,env);
 return {env,main,scope,card,io,mo,reduce,stop};
}
test('mobile section reveals run once with visible movement and safe viewport threshold',()=>{
 const h=setup();h.env.flush();assert.equal(h.io[0].options.threshold,0);
 h.io[0].trigger(h.card);h.io[0].trigger(h.card);
 assert.equal(h.card.records.length,1);assert.equal(h.card.records[0].options.duration,650);
 assert.equal(h.card.records[0].frames[0].transform,'translateY(24px)');h.stop();
});
test('late mounted mobile route content is observed without repeating old entrances',()=>{
 const h=setup();h.env.flush();h.io[0].trigger(h.card);
 const late=new Element(['[data-reveal]']);h.main.nodes.push(late);h.mo[0].fn();h.env.flush();
 assert.ok(h.io[0].elements.has(late));assert.ok(!h.io[0].elements.has(h.card));
 h.io[0].trigger(late);assert.equal(late.records.length,1);h.stop();
});
test('slow mobile hero images animate after load rather than before they are visible',()=>{
 const h=setup(),hero=new Element(),photo=new Element();photo.complete=false;photo.naturalWidth=0;
 hero.queries.set('.hero-photo',photo);h.main.queries.set('.hero',hero);h.env.flush();
 assert.equal(photo.records.length,0);photo.emit('load');assert.equal(photo.records[0].options.duration,1200);
 assert.equal(photo.records[0].frames[0].transform,'scale(1.04)');h.stop();
});
test('mobile cards get image zoom, brand-border emphasis and arrow feedback without hover',()=>{
 const h=setup(),card=new Element(['.reference-service-card']),photo=new Element(),arrow=new Element();
 photo.complete=true;photo.naturalWidth=400;card.queries.set('img',photo);card.queries.set('.card-corner',arrow);
 h.card.queries.set('.reference-service-card',card);h.env.flush();h.io[0].trigger(h.card);
 assert.equal(photo.records[0].options.duration,850);assert.equal(card.records[0].frames[1].borderColor,'#ffcc32');
 assert.equal(arrow.records.length,1);h.stop();
});
test('touch press and cancellation animate feedback without preventing native clicks or scrolling',()=>{
 const h=setup(),button=new Element(['.button']);h.env.flush();let prevented=false;
 h.main.emit('pointerdown',{target:button,pointerType:'touch',pointerId:1,preventDefault(){prevented=true;}});
 assert.equal(button.records[0].frames[1].transform,'scale(.975)');
 h.env.emit('pointercancel',{pointerId:1});assert.equal(button.records[1].frames[1].transform,'scale(1)');
 assert.equal(prevented,false);h.stop();
});
test('reduced motion and live preference changes cancel movement',()=>{
 const reduced=setup({reduced:true});reduced.env.flush();reduced.io[0].trigger(reduced.card);
 assert.equal(reduced.card.records.length,0);assert.equal(reduced.main.records.length,0);reduced.stop();
 const h=setup();h.env.flush();h.io[0].trigger(h.card);h.reduce.matches=true;h.reduce.emit('change');
 assert.equal(h.card.records[0].cancelled,true);h.stop();
});
test('older mobile WebViews fall back to CSS without requiring animate or IntersectionObserver',()=>{
 const h=setup({observation:false,webAnimations:false});h.env.flush();
 assert.ok(h.card.classes.has('motion-fallback-reveal'));h.stop();assert.equal(h.card.classes.size,0);
});
test('route cleanup removes observers, pending image handlers and touch listeners',()=>{
 const h=setup(),hero=new Element(),photo=new Element();hero.queries.set('.hero-photo',photo);h.main.queries.set('.hero',hero);
 h.env.flush();h.stop();photo.emit('load');
 assert.equal(photo.records.length,0);assert.ok(h.io.every(observer=>observer.disconnected));
 assert.equal(h.main.listeners.get('pointerdown').size,0);assert.equal(h.env.listeners.get('pointerup').size,0);
});
test('desktop keeps its original reveal timing rather than inheriting phone movement',()=>{
 const h=setup({mobile:false});h.env.flush();h.io[0].trigger(h.card);
 assert.equal(h.card.records[0].options.duration,600);assert.equal(h.card.records[0].frames[0].transform,'translateY(20px)');h.stop();
});
