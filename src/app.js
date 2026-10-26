// SPDX-License-Identifier: GPL-3.0-only
import {taskInput,terminalStates,unwrap} from './client.js';
import {readDraft} from './task-draft.js';
import {profileFrom,selectSavedCompanion} from './connection-profile.js';
const $=id=>document.getElementById(id);
const labels={starting:'正在开始',connecting:'连接中',observing:'读取界面',planning:'AI 规划',executing:'执行中',awaiting_confirmation:'需要首次设置',awaiting_user:'等待返回软件',completed:'任务已结束',failed:'未完成',cancelled:'已停止',review_required:'请人工核对'};
const call=(method,params={})=>window.Skivu.call(method,params).then(unwrap);
let connection=null,taskId=null,timer=null,profile=null,lastTaskKey='last-task',active=false,refreshing=false;
const locks=new Set();
let modelName='未选择',modelSource='';
function budgetSummary(){ $('model-summary').textContent=`当前模型：${modelName}${modelSource?'（'+modelSource+'）':''} · 最多 ${$('max-actions').value} 次操作 / ${$('max-rounds').value} 次模型请求 / ${$('timeout').value} 秒。模型请求可能消耗额度。`; }
for(const id of ['max-actions','max-rounds','timeout'])$(id).addEventListener('input',budgetSummary);
function notice(text=''){$('notice').textContent=text;$('notice').hidden=!text;}
async function job(fn){try{notice();return await fn();}catch(e){notice(e?.message||String(e));}}
async function action(id,fn){if(locks.has(id))return;locks.add(id);$(id).disabled=true;try{return await job(fn);}finally{locks.delete(id);$(id).disabled=id==='start' && active;}}
async function saveProfile(){if(profile)await call('storage.set',{key:'connection-profile',value:profile});}
async function status(){
  if(!connection)throw new Error('请先连接设备伴侣。');
  const state=await call('device.status',{connectionId:connection});
  modelName=state.modelName || '未选择';modelSource=state.modelSource || '';budgetSummary();
  $('connection-state').textContent=!state.approved?'待首次信任':state.directControlApproved?'可直接操控':'待开启直接操控';
  $('approve').textContent=state.directControlApproved?'伴侣与信任设置':'打开伴侣信任直接操控';
  if(!state.approved || !state.directControlApproved)notice('首次使用：打开设备伴侣，核对客户端并选择“信任此客户端，后续直接操控并返回”。');
  else if(state.accessibilityEnabled===false)notice('无障碍尚未开启，请在伴侣中打开系统设置后返回。');
  return state;
}
async function discover(){
  const items=await call('device.discover');$('companions').replaceChildren();
  for(const item of items || []){const option=document.createElement('option');option.value=item.component;option.textContent=`${item.label} · ${item.signerSha256?.slice(0,8) || ''}`;option.dataset.signer=item.signerSha256 || '';$('companions').append(option);}
  if(!items?.length)notice('尚未找到设备伴侣。请下载安装后返回刷新。');
  const saved=selectSavedCompanion(items || [],profile);
  if(saved)$('companions').value=saved.component;
  return saved;
}
async function loadApps(){
  const state=await status();if(!state.approved)throw new Error('请先在设备伴侣中信任客户端。');
  const selected=$('apps').value || profile?.app || '';
  const value=await call('device.apps',{connectionId:connection});$('apps').replaceChildren();
  const empty=document.createElement('option');empty.value='';empty.textContent='请选择允许操作的软件';$('apps').append(empty);
  for(const item of value.apps || []){const option=document.createElement('option');option.value=item.package_name;option.textContent=item.label;$('apps').append(option);}
  if([...$('apps').options].some(option=>option.value===selected))$('apps').value=selected;
}
async function connect(){
  const component=$('companions').value;if(!component)throw new Error('请先查找并选择设备伴侣。');
  const signer=$('companions').selectedOptions[0]?.dataset.signer;
  const expected=profile?.component===component?profile.signerSha256:signer;
  const result=await call('device.connect',{component,signerSha256:expected});if(!result)return;
  connection=result.connectionId;
  profile=profileFrom({component,signerSha256:result.signerSha256,app:profile?.app || ''});
  await saveProfile();const state=await status();if(state.approved)await loadApps();
}
async function refreshTask(){
  if(!taskId || refreshing)return;refreshing=true;
  try{
    const requested=taskId,scope=lastTaskKey;
    const task=await call('agent.tasks.get',{taskId:requested});if(taskId!==requested || lastTaskKey!==scope)return;
    $('task-state').textContent=labels[task.state] || task.state;$('summary').textContent=task.summary;
    $('actions').textContent=task.actions || 0;$('rounds').textContent=task.rounds || 0;
    active=!terminalStates.has(task.state);$('start').disabled=active;$('stop').disabled=!active;
    if(!active){clearInterval(timer);timer=null;}
    return task;
  }finally{refreshing=false;}
}
function poll(){clearInterval(timer);timer=setInterval(()=>job(refreshTask),1500);}
async function openCompanion(){if(!connection)throw new Error('请先连接设备伴侣。');await call('device.openCompanion',{connectionId:connection});}
$('discover').onclick=()=>action('discover',discover);
$('connect').onclick=()=>action('connect',connect);
$('refresh').onclick=()=>action('refresh',async()=>{const state=await status();if(state.approved)await loadApps();});
$('load-apps').onclick=()=>action('load-apps',loadApps);
$('approve').onclick=()=>action('approve',openCompanion);
$('task-confirm').onclick=()=>action('task-confirm',openCompanion);
$('role-settings').onclick=()=>job(()=>call('ui.roleSettings'));
$('download').onclick=()=>job(()=>call('ui.openExternal',{url:'https://github.com/skyjjgw/skivu-device-bridge/releases'}));
$('forget').onclick=()=>action('forget',async()=>{
  if(active)throw new Error('请先停止当前任务，再更换连接。');
  if(connection)await call('device.disconnect',{connectionId:connection});
  connection=null;profile=null;await call('storage.remove',{key:'connection-profile'});
  $('connection-state').textContent='未连接';await discover();notice('请核对伴侣来源后重新连接。');
});
$('apps').onchange=()=>job(async()=>{if(profile){profile.app=$('apps').value;await saveProfile();}});
$('start').onclick=()=>action('start',async()=>{
  const params=taskInput({goal:$('goal').value,app:$('apps').value,maxActions:Number($('max-actions').value),maxRounds:Number($('max-rounds').value),timeoutSeconds:Number($('timeout').value),connectionId:connection});
  const scope=lastTaskKey;const task=await call('agent.tasks.start',params);if(!task)return;
  await call('storage.set',{key:scope,value:task});
  if(scope!==lastTaskKey)return;taskId=task.taskId;active=true;await refreshTask();if(active)poll();
});
$('task-refresh').onclick=()=>action('task-refresh',refreshTask);
$('stop').onclick=()=>action('stop',async()=>{if(taskId)await call('agent.tasks.cancel',{taskId});await refreshTask();});
async function resume(){if(connection){const state=await status();if(state.approved)await loadApps();}await refreshTask();if(active)poll();}
window.addEventListener('focus',()=>job(resume));
window.Skivu?.on('host.resume',()=>job(resume));
window.Skivu?.on('context.changed',context=>{
  clearInterval(timer);timer=null;taskId=null;active=false;
  lastTaskKey=`last-task:${context.spaceId || 'manual'}`;$('goal').value='';$('prepared-draft').hidden=true;
  $('start').disabled=false;$('stop').disabled=true;
  $('task-state').textContent='尚未开始';$('actions').textContent='0';$('rounds').textContent='0';
  $('summary').textContent='上下文已切换。已启动的任务可从通知停止，新任务需要重新核对。';
  notice('角色或聊天上下文已切换，请重新填写任务，或重新打开对应的任务卡片。');
});
job(async()=>{
  if(!window.Skivu)throw new Error('请在支持设备任务的 Skivu 宿主中打开此插件。');
  const info=await call('host.info');if(!info.methods?.includes('device.disconnect'))throw new Error('请更新到支持直接操控的新宿主版本。');
  const context=await call('context.get');lastTaskKey=`last-task:${context.spaceId || 'manual'}`;
  const draft=await readDraft(call,context);if(draft){$('goal').value=draft.goal;$('prepared-draft').hidden=false;$('prepared-draft').textContent=`当前角色的任务草稿${draft.appHint?' · 软件提示：'+draft.appHint:''}。请选择软件后开始，尚未执行。`;}
  const previous=await call('storage.get',{key:lastTaskKey});if(previous?.taskId){taskId=previous.taskId;try{await refreshTask();if(active)poll();}catch{taskId=null;notice('暂时无法读取上次结果，请核对真实软件；不会自动重复操作。');}}
  profile=profileFrom(await call('storage.get',{key:'connection-profile'}));
  const saved=await discover();if(saved)await connect();
});
