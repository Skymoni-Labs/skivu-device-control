import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareDraft,readDraft,draftKey} from '../src/task-draft.js';
const context={roleBound:true,roleId:'role-a',chatId:'chat-a',spaceId:'a'.repeat(64)};
function storage() {
  const values=new Map(),calls=[];
  return {calls,call:async(method,p)=>{
    calls.push(method);
    if(method==='storage.get')return values.get(p.key) ?? null;
    if(method==='storage.compareAndSet') {
      assert.deepEqual(values.get(p.key) ?? null,p.expected);values.set(p.key,p.value);return true;
    }
    throw new Error('Unexpected capability: '+method);
  }};
}
test('role tool saves only a CAS draft and returns a non-executed task card',async()=>{
  const s=storage(),result=await prepareDraft(s.call,{goal:'写入草稿，不发送',appHint:'测试便签'},context);
  assert.equal(result.state,'prepared');assert.equal(result.card.action,'new-task');
  assert.deepEqual(s.calls,['storage.get','storage.compareAndSet']);
  const draft=await readDraft(s.call,{...context,payload:result.card.payload});
  assert.equal(draft.goal,'写入草稿，不发送');assert.equal(draft.appHint,'测试便签');
});
test('a different role or story cannot load the prepared card',async()=>{
  const s=storage(),result=await prepareDraft(s.call,{goal:'只读查询'},context);
  await assert.rejects(readDraft(s.call,{...context,roleId:'role-b',payload:result.card.payload}));
  await assert.rejects(readDraft(s.call,{...context,spaceId:'b'.repeat(64),payload:result.card.payload}));
  assert.throws(()=>draftKey({...context,roleBound:false}));
});
test('superseded cards and CAS conflicts do not silently replay a write',async()=>{
  const s=storage(),first=await prepareDraft(s.call,{goal:'原目标'},context);
  await prepareDraft(s.call,{goal:'新目标'},context);
  await assert.rejects(readDraft(s.call,{...context,payload:first.card.payload}));
  let writes=0;
  await assert.rejects(prepareDraft(async method=>{if(method==='storage.get')return null;writes++;throw new Error('REVISION_CONFLICT');},{goal:'目标'},context));
  assert.equal(writes,1);
});
test('oversized or empty role goals are rejected before any storage call',async()=>{
  let calls=0;const call=async()=>{calls++;};
  await assert.rejects(prepareDraft(call,{goal:' '},context));
  await assert.rejects(prepareDraft(call,{goal:'a'.repeat(4001)},context));
  assert.equal(calls,0);
});
