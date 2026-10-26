import test from 'node:test';import assert from 'node:assert/strict';import{taskInput,terminalStates,unwrap}from'../src/client.js';
const input={goal:'填写便签',app:'org.example.notes',maxActions:20,maxRounds:15,timeoutSeconds:300,connectionId:'local-connection'};
test('task scope contains only the explicitly selected app',()=>assert.deepEqual(taskInput(input).allowedPackages,['org.example.notes']));
test('empty goals and unpaired connections cannot start',()=>{assert.throws(()=>taskInput({...input,goal:' '}));assert.throws(()=>taskInput({...input,connectionId:null}));});
test('budgets are bounded and not silently coerced',()=>{for(const override of[{maxActions:31},{maxRounds:31},{timeoutSeconds:601},{maxRounds:'15'}])assert.throws(()=>taskInput({...input,...override}));});
test('execution uncertainty is terminal for polling and never success',()=>{assert(terminalStates.has('review_required'));assert.throws(()=>unwrap({error:{message:'Result unknown'}}));});
