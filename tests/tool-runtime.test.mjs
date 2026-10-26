import test from 'node:test';
import assert from 'node:assert/strict';

test('tool entry registers before ready and handles drafts without a device capability',async()=>{
  let handler,complete=null,value=null;
  const calls=[];
  globalThis.Skivu={
    on:(event,callback)=>{assert.equal(event,'companion.invoke');handler=callback;},
    call:async(method,p)=>{
      calls.push(method);
      if(method==='runtime.ready'){assert.equal(typeof handler,'function');return true;}
      if(method==='context.get')return {roleBound:true,roleId:'r',chatId:'c',spaceId:'a'.repeat(64)};
      if(method==='storage.get')return value;
      if(method==='storage.compareAndSet'){assert.deepEqual(p.expected,value);value=p.value;return true;}
      if(method==='runtime.complete'){complete=p.result;return true;}
      throw new Error('Unexpected privileged capability '+method);
    },
  };
  try {
    await import('../src/tool-runtime.js');
    await handler({tool:'prepare_task',arguments:{goal:'本机测试草稿'}});
    assert.equal(complete.state,'prepared');
    assert.deepEqual(calls,['runtime.ready','context.get','storage.get','storage.compareAndSet','runtime.complete']);
    calls.length=0;
    await handler({tool:'unknown_tool',arguments:{}});
    assert.equal(complete.success,false);
    assert.deepEqual(calls,['runtime.complete']);
  } finally { delete globalThis.Skivu; }
});
