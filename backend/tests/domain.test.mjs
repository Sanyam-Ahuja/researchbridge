import test from 'node:test';
import assert from 'node:assert/strict';
import { getWorkspace, opportunities, reviewApplication, score, seed, submitApplication } from '../src/domain.ts';

test('transparent matching score supports application review and accepted membership',()=>{
  const state=structuredClone(seed);const opp=opportunities[0];const match=score(opp);assert.equal(match.weights.skills,.4);assert.ok(match.score>0&&match.score<=100);
  const app=submitApplication(state,opp.id,'I would like to contribute.');assert.equal(app.status,'submitted');assert.throws(()=>getWorkspace(state,opp.project_id),{status:403});
  for(const status of ['under_review','shortlisted','selected','offer_accepted'])reviewApplication(state,app.id,status);
  assert.equal(getWorkspace(state,opp.project_id).id,opp.project_id);
});

test('application state machine rejects skipped decisions',()=>{
  const state=structuredClone(seed);const app=submitApplication(state,opportunities[0].id,'Test');assert.throws(()=>reviewApplication(state,app.id,'selected'),{status:409});
});
