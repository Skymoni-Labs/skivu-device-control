// SPDX-License-Identifier: GPL-3.0-only
export function profileFrom(value) {
  if(!value || typeof value.component!=='string' || value.component.length>300 ||
      !/^[a-zA-Z][a-zA-Z0-9_.]+\/[a-zA-Z0-9_.$]+$/.test(value.component) ||
      typeof value.signerSha256!=='string' || !/^[a-f0-9]{64}(?::[a-f0-9]{64})*$/.test(value.signerSha256))return null;
  return {component:value.component,signerSha256:value.signerSha256,
    app:typeof value.app==='string' && value.app.length<=255?value.app:''};
}
export function selectSavedCompanion(items,profile) {
  const saved=profileFrom(profile);if(!saved)return null;
  const current=items.find(item=>item.component===saved.component);
  if(!current)return null;
  if(current.signerSha256!==saved.signerSha256) {
    const error=new Error('设备伴侣签名已改变，请先核对来源，再使用“更换连接”重新设置。');
    error.code='COMPANION_CHANGED';throw error;
  }
  return current;
}
