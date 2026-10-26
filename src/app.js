// SPDX-License-Identifier: GPL-3.0-only
import {taskInput,terminalStates,unwrap} from './client.js';
import {readDraft} from './task-draft.js';
const $=id=>document.getElementById(id);
const labels={starting:'正在开始',connecting:'连接中',observing:'读取界面',planning:'AI 规划',executing:'执行中',awaiting_confirmation:'需要确认',completed:'任务已结束',failed:'未完成',cancelled:'已停止',review_required:'请人工核对'};
let connection=null,taskId=null,timer=null;
let lastTaskKey='last-task';
const call=(method,params={})=>window.Skivu.call(method,params).then(unwrap);
function notice(text=''){$('notice').textContent=text;$('notice').hidden=!text;}
async function job(fn){try{notice();await fn();}catch(e){notice(e?.message||String(e));}}
async function status(){if(!connection)throw new Error('请先连接设备伴侣。');const state=await call('device.status',{connectionId:connection});$('connection-state').textContent=state.approved?'已配对':'待人工批准';return state;}
async function refreshTask(){if(!taskId)return;const task=await call('agent.tasks.get',{taskId});$('task-state').textContent=labels[task.state]||task.state;$('summary').textContent=task.summary;$('actions').textContent=task.actions||0;$('rounds').textContent=task.rounds||0;if(terminalStates.has(task.state)){clearInterval(timer);timer=null;}return task;}
$('discover').onclick=()=>job(async()=>{const items=await call('device.discover');$('companions').replaceChildren();for(const item of items||[]){const option=document.createElement('option');option.value=item.component;option.textContent=item.label;$('companions').append(option);}if(!items?.length)notice('尚未找到设备伴侣。请先下载安装，再返回查找。');});
$('connect').onclick=()=>job(async()=>{const result=await call('device.connect',{component:$('companions').value});if(!result)return;connection=result.connectionId;await status();if(!result.approved)notice('配对请求已提交。请打开设备伴侣，核对客户端名称和签名后亲自批准。');});
async function openCompanion(){if(!connection)throw new Error('请先请求配对。');await call('device.openCompanion',{connectionId:connection});}
$('approve').onclick=()=>job(openCompanion);$('task-confirm').onclick=()=>job(openCompanion);
$('refresh').onclick=()=>job(status);
$('role-settings').onclick=()=>job(()=>call('ui.roleSettings'));
$('download').onclick=()=>job(()=>call('ui.openExternal',{url:'https://github.com/skyjjgw/skivu-device-bridge/releases'}));
$('load-apps').onclick=()=>job(async()=>{const state=await status();if(!state.approved)throw new Error('请先在伴侣中批准连接。');const value=await call('device.apps',{connectionId:connection});$('apps').replaceChildren();for(const item of value.apps||[]){const option=document.createElement('option');option.value=item.package_name;option.textContent=item.label;$('apps').append(option);}});
$('start').onclick=()=>job(async()=>{const params=taskInput({goal:$('goal').value,app:$('apps').value,maxActions:Number($('max-actions').value),maxRounds:Number($('max-rounds').value),timeoutSeconds:Number($('timeout').value),connectionId:connection});$('start').disabled=true;try{const task=await call('agent.tasks.start',params);if(!task)return;taskId=task.taskId;await window.Skivu.call('storage.set',{key:lastTaskKey,value:task});await refreshTask();clearInterval(timer);timer=setInterval(()=>job(refreshTask),1500);}finally{$('start').disabled=false;}});
$('task-refresh').onclick=()=>job(refreshTask);$('stop').onclick=()=>job(async()=>{if(taskId)await call('agent.tasks.cancel',{taskId});await refreshTask();});
window.addEventListener('focus',()=>job(async()=>{if(connection)await status();await refreshTask();}));
window.Skivu?.on('context.changed',context=>{
  clearInterval(timer);timer=null;taskId=null;
  lastTaskKey=`last-task:${context.spaceId || 'manual'}`;
  $('goal').value='';$('prepared-draft').hidden=true;
  $('task-state').textContent='尚未开始';$('actions').textContent='0';$('rounds').textContent='0';
  $('summary').textContent='上下文已切换。已启动的任务可从通知停止，新任务需要重新核对。';
  notice('角色或聊天上下文已切换，请重新填写任务，或重新打开对应的任务卡片。');
});
job(async()=>{if(!window.Skivu)throw new Error('请在支持设备任务的 Skivu 宿主中打开此插件。');const info=await call('host.info');if(!info.methods?.includes('agent.tasks.start'))throw new Error('此宿主还没有设备任务能力，请先更新 App。');const context=await call('context.get');lastTaskKey=`last-task:${context.spaceId || 'manual'}`;const draft=await readDraft(call,context);if(draft){$('goal').value=draft.goal;$('prepared-draft').hidden=false;$('prepared-draft').textContent=`来自当前角色的待确认任务${draft.appHint ? ' · 软件提示：'+draft.appHint : ''}。尚未执行，请配对、选择软件并确认。`;}const previous=await call('storage.get',{key:lastTaskKey});if(previous?.taskId){taskId=previous.taskId;try{await refreshTask();}catch{taskId=null;$('summary').textContent='上次任务已离开当前运行进程。请先核对真实软件，不会自动重复操作。';}}});
