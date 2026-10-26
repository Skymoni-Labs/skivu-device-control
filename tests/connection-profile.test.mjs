import test from 'node:test';
import assert from 'node:assert/strict';
import {profileFrom,selectSavedCompanion} from '../src/connection-profile.js';
const profile={component:'org.test.bridge/org.test.bridge.Service',signerSha256:'a'.repeat(64),app:'org.test.notes'};
test('only a previously selected companion with the same signer is restored automatically',()=>{
  const item={...profile,label:'Test bridge'};
  assert.equal(selectSavedCompanion([item],profile),item);
  assert.equal(selectSavedCompanion([],profile),null);
});
test('a reinstalled companion with a different signer never reconnects silently',()=>{
  assert.throws(()=>selectSavedCompanion([{...profile,signerSha256:'b'.repeat(64)}],profile),{code:'COMPANION_CHANGED'});
});
test('malformed, unpinned and credential-like stored profiles are not connection instructions',()=>{
  for(const value of [null,{}, {...profile,signerSha256:''},{...profile,component:'http://example.test'}])assert.equal(profileFrom(value),null);
  assert.deepEqual(profileFrom({...profile,token:'private-key'}),profile);
});
