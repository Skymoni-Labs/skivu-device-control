// SPDX-License-Identifier: GPL-3.0-only
export const terminalStates = new Set(['completed','failed','cancelled','review_required']);
export function taskInput({goal,app,maxActions,maxRounds,timeoutSeconds,connectionId}) {
  if(typeof goal!=='string'||!goal.trim()||goal.length>4000||goal.includes('\0'))throw new Error('请先写下你希望完成的任务。');
  if(typeof app!=='string'||app.length>255||!/^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z0-9_]+)+$/.test(app))throw new Error('请选择一个允许操作的软件。');
  for(const [n,min,max] of [[maxActions,1,30],[maxRounds,1,30],[timeoutSeconds,30,600]])if(!Number.isInteger(n)||n<min||n>max)throw new Error('任务预算超出范围。');
  if(!connectionId)throw new Error('请先连接并批准设备伴侣。');
  return{goal:goal.trim(),allowedPackages:[app],maxActions,maxRounds,timeoutSeconds,connectionId};
}
export function unwrap(value) {
  if(value?.error) {
    const messages={UNAUTHORIZED:'设备授权已撤销，请打开伴侣重新信任客户端。',
      ACCESSIBILITY_UNAVAILABLE:'请在设备伴侣中打开系统无障碍服务后重试。',
      LOCAL_INPUT_REQUIRED:'此输入需要你在手机上亲自完成，完成后可重新发起任务。',
      DIRECT_APPROVAL_REQUIRED:'首次使用请在设备伴侣中信任直接操控，之后无需逐步确认。',
      DEVICE_BUSY:'已有任务正在使用设备，请先停止当前任务。',
      TASK_REVOKED:'任务已过期或授权已撤销，请核对设备后重新开始。',
      APP_OUT_OF_SCOPE:'当前软件不在本次允许范围内，请返回所选软件，或停止任务后重新选择。'};
    const error=new Error(messages[value.error.code]||value.error.message||'设备请求没有完成。');
    error.code=value.error.code;throw error;
  }
  return value;
}
