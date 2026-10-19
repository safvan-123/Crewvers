import test from 'node:test';
import assert from 'node:assert/strict';
import {mergeServices} from '../lib/service-content.mjs';
const defaults = [{id:'event-staffing',title:'Original title',short:'Original short',description:'Original description',roles:['Crew'],image:'/images/event.webp',alt:'Original image',number:'01'}];
test('unconnected CMS preserves all fallback service content and does not mutate it', () => {
 const copy = structuredClone(defaults);
 assert.deepEqual(mergeServices(defaults, undefined), defaults);
 assert.deepEqual(mergeServices(defaults, [{id:'unknown',title:'Unknown'}]), defaults);
 assert.deepEqual(defaults, copy);
});
test('published service edits update supported fields while retaining route keys and order', () => {
 const [service] = mergeServices(defaults, [{id:'event-staffing',number:'99',title:'Edited',short:'Summary',description:'Description',roles:['Hosts'],image:{url:'https://cdn.sanity.io/images/project/production/photo-100x100.jpg',alt:'Edited photo'}}]);
 assert.equal(service.id,'event-staffing');
 assert.equal(service.number,'01');
 assert.equal(service.title,'Edited');
 assert.deepEqual(service.roles,['Hosts']);
 assert.match(service.image,/^https:/);
 assert.equal(service.alt,'Edited photo');
});
test('blank or malformed CMS overrides retain usable content and original assets', () => {
 const [service] = mergeServices(defaults,[{id:'event-staffing',title:42,short:' ',description:null,roles:[false,' '],image:{url:'javascript:alert(1)',alt:'Invalid'}}]);
 assert.deepEqual(service,defaults[0]);
});

test('existing preview cards keep original defaults and inherit category descriptions', async () => {
 const {mergeServicePreviews} = await import('../lib/service-content.mjs');
 const cards = [{key:'existing-card',groupId:'event-staffing',title:'Existing card',image:'/images/event.webp',icon:'users'}];
 const [card] = mergeServicePreviews(cards,defaults,undefined);
 assert.equal(card.title,'Existing card');assert.equal(card.image,'/images/event.webp');
 assert.equal(card.short,'Original short');assert.equal(card.alt,'Original image');
});
test('CMS preview edits update existing cards without changing links, icons or count', async () => {
 const {mergeServicePreviews} = await import('../lib/service-content.mjs');
 const cards = [{key:'existing-card',groupId:'event-staffing',title:'Existing card',image:'/images/event.webp',icon:'users'}];
 const result = mergeServicePreviews(cards,defaults,[{key:'existing-card',groupId:'other',icon:'other',title:'Edited title',short:'Edited copy',image:{url:'https://cdn.sanity.io/images/project/production/photo-100x100.jpg',alt:'New card photo'}},{key:'new-card',title:'Extra'}]);
 assert.equal(result.length,1);assert.equal(result[0].groupId,'event-staffing');assert.equal(result[0].icon,'users');
 assert.equal(result[0].title,'Edited title');assert.equal(result[0].short,'Edited copy');assert.equal(result[0].alt,'New card photo');
});
