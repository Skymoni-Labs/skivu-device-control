// SPDX-License-Identifier: GPL-3.0-only
import {prepareDraft} from './task-draft.js';
import {unwrap} from './client.js';
const call=(method,params={})=>Skivu.call(method,params).then(unwrap);
Skivu.on('companion.invoke',async event=>{
  let result;
  try {
    if(event.tool !== 'prepare_task') throw new Error('不支持的任务草稿工具。');
    result=await prepareDraft(call,event.arguments,await call('context.get'));
  } catch(error) { result={success:false,summary:error?.message || '任务草稿未保存。'}; }
  await Skivu.call('runtime.complete',{result});
});
await Skivu.call('runtime.ready',{});
