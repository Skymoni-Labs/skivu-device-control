// SPDX-License-Identifier: GPL-3.0-only
export const terminalStates = new Set(['completed','failed','cancelled','review_required']);
export function taskInput({goal,app,maxActions,maxRounds,timeoutSeconds,connectionId}) {
  if(typeof goal!=='string'||!goal.trim()||goal.length>4000)throw new Error('请先写下你希望完成的任务。');
  if(typeof app!=='string'||!app.includes('.'))throw new Error('请选择一个允许操作的软件。');
  for(const [n,min,max] of [[maxActions,1,30],[maxRounds,1,15],[timeoutSeconds,30,600]])if(!Number.isInteger(n)||n<min||n>max)throw new Error('任务预算超出范围。');
  if(!connectionId)throw new Error('请先连接并批准设备伴侣。');
  return{goal:goal.trim(),allowedPackages:[app],maxActions,maxRounds,timeoutSeconds,connectionId};
}
export function unwrap(value) {
  if(value?.error)throw new Error(value.error.message||'设备请求没有完成。');
  return value;
}
