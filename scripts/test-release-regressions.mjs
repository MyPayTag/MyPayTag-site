import assert from "node:assert/strict";
import { test } from "node:test";
import { updatedPreferenceGroup } from "../src/lib/portal-preferences.ts";
import { groupPortalHistoryItems } from "../src/lib/portal-history.ts";
import { quoteAmountValue } from "../src/lib/quote-amount.ts";

const group = { paytagRef: "a", chain: "eip155:1", network: "mainnet", asset: "ETH", routes: [] };
test("preferences accepts both deployed group and contract envelope, selecting exact scope", () => {
  assert.equal(updatedPreferenceGroup(group, group), group);
  assert.equal(updatedPreferenceGroup({groups: [{...group, paytagRef: "b"}, group]}, group), group);
  assert.equal(updatedPreferenceGroup({groups: [{...group, payingDapp: {id: "foreign"}}]}, group), undefined);
  assert.equal(updatedPreferenceGroup({...group, routes: undefined}, group), undefined);
  assert.equal(updatedPreferenceGroup(null, group), undefined);
});
test("token quote input preserves small and high precision amounts", () => {
  for (const value of ["0.001", "0.123456", "1.000000000000000001"]) assert.equal(quoteAmountValue(value, "token"), value);
  assert.equal(quoteAmountValue(".001", "token"), "0.001");
  assert.equal(quoteAmountValue("25", "usd"), "25.00");
  for (const value of ["0", "-1", "NaN", "Infinity", "1e3", ""]) assert.throws(() => quoteAmountValue(value, "token"));
});
test("resolved answers group by their selected receiving app with answer-only filtering", () => {
  const answer = {kind: "answer", id: "a", questionId: "q", createdAt: "2026-11-20", status: "resolved", selectedPayToDapp: {id: "smartrust", displayName: "SmarTrust"}};
  const groups = groupPortalHistoryItems([answer], "payto-app", "answers");
  assert.deepEqual(groups.get("SmarTrust"), [answer]);
  assert.equal(groups.has("No PayToDapp selected"), false);
});
