import test from 'node:test';
import assert from 'node:assert/strict';
import {fetchPublished, queryUrl, filterPublishedEvents} from '../lib/cms-core.mjs';
test('CMS requests enforce the published perspective and encode queries', () => {
 const url=queryUrl('abc12345','production','*[_type == "event"]');
 assert.equal(url.searchParams.get('perspective'),'published');
 assert.equal(url.searchParams.get('query'),'*[_type == "event"]');
 assert.equal(url.hostname,'abc12345.api.sanity.io');
 assert.throws(()=>queryUrl('evil.test/path','production','*'));
});
test('unconfigured website needs no CMS credentials or network access', async () => {
 assert.equal(await fetchPublished('*',{fetcher:()=>{throw Error('network should not run')}}),null);
});
test('a configured CMS failure stops a build instead of silently erasing events', async () => {
 await assert.rejects(fetchPublished('*',{projectId:'abc12345',fetcher:async()=>({ok:false,status:403})}),/403/);
 await assert.rejects(fetchPublished('*',{projectId:'abc12345',fetcher:async()=>({ok:true,json:async()=>({error:'bad query'})})}),/invalid query/);
});
test('draft, release, invalid and duplicate events cannot create public routes', () => {
 const event={_id:'event-1',title:'Test event',slug:'test-event',startDate:'2030-05-01T12:00:00Z'};
 const result=filterPublishedEvents([event,{...event,_id:'drafts.event-2',slug:'draft-event'},{...event,_id:'versions.release.event-3',slug:'release-event'},{...event,_id:'duplicate'},{...event,slug:'../escape'},{...event,slug:'bad-date',startDate:'invalid'}]);
 assert.deepEqual(result,[event]);
});
test('published response is passed through without requiring a write token', async () => {
 const result=await fetchPublished('*',{projectId:'abc12345',fetcher:async(url,options)=>{
  assert.equal(url.searchParams.get('perspective'),'published');
  assert.equal(options.headers,undefined);
  return {ok:true,json:async()=>({result:[{title:'Published'}]})};
 }});
 assert.deepEqual(result,[{title:'Published'}]);
});
