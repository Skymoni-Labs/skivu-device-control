// SPDX-License-Identifier: GPL-3.0-only
// Chat tools prepare local drafts; no device or model calls are made here.
export function newDraftId(provider=globalThis.crypto) {
  if(typeof provider?.randomUUID==='function')return provider.randomUUID();
  if(typeof provider?.getRandomValues!=='function')throw new Error('当前系统 WebView 不支持安全随机数，请更新 Android System WebView 后重试。');
  const bytes=provider.getRandomValues(new Uint8Array(16));
  bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
  const hex=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
export function draftKey(context) {
  if (context?.roleBound !== true || !/^[a-f0-9]{64}$/.test(context?.spaceId || '') ||
      typeof context.roleId !== 'string' || !context.roleId ||
      typeof context.chatId !== 'string' || !context.chatId) {
    throw new Error('请先为当前角色绑定手机操控插件。');
  }
  return `task-draft:${context.spaceId}`;
}
export function validateDraftArguments(args) {
  if (!args || typeof args.goal !== 'string' || !args.goal.trim() ||
      args.goal.length > 4000 || /\0/.test(args.goal) ||
      (args.appHint !== undefined && (typeof args.appHint !== 'string' ||
       args.appHint.length > 120 || /\0/.test(args.appHint)))) {
    throw new Error('任务目标或软件提示无效。');
  }
  return {goal:args.goal.trim(),appHint:(args.appHint || '').trim()};
}
export async function prepareDraft(call,args,context) {
  const key=draftKey(context),input=validateDraftArguments(args);
  const value={...input,id:newDraftId(),roleId:context.roleId,
    chatId:context.chatId,spaceId:context.spaceId,state:'prepared'};
  const previous=await call('storage.get',{key});
  await call('storage.compareAndSet',{key,expected:previous ?? null,value});
  return {success:true,state:'prepared',draftId:value.id,
    summary:'已准备手机任务草稿，尚未连接、读屏或执行。请打开卡片，选择软件并单独确认。',
    card:{title:'待确认的手机任务',summary:input.goal.slice(0,100),
      action:'new-task',payload:{draftId:value.id}}};
}
export async function readDraft(call,context) {
  if (!context?.payload?.draftId) return null;
  const value=await call('storage.get',{key:draftKey(context)});
  if (!value || value.id !== context.payload.draftId ||
      value.roleId !== context.roleId || value.chatId !== context.chatId ||
      value.spaceId !== context.spaceId || value.state !== 'prepared') {
    throw new Error('任务草稿已更新、角色不匹配或不再可用，请重新准备。');
  }
  return {...validateDraftArguments(value),id:value.id};
}
