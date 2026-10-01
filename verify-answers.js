/*
 * Regression check for the Arizona MVD sample-test answer key.
 * Expected indexes were independently audited against the current Arizona
 * Driver License Manual, the source diagrams, and corroborating answer sets.
 * Run with: node verify-answers.js
 */
const fs = require("fs");
const vm = require("vm");

const explanations = fs.readFileSync("explanations.js", "utf8");
const source = explanations + "\n" + fs.readFileSync("app.js", "utf8").split("const app =")[0];
const sandbox = {};
vm.runInNewContext(`${source}; auditedQuestions = QUESTIONS;`, sandbox);

const expected = {
  1: [0, 2, 2, 0, 1, 1, 0, 2, 1, 2, 2, 1, 0, 0, 0, 1, 2, 0, 2, 1, 0, 1, 2, 2, 0, 1, 0, 2, 0, 1, 0, 2, 2, 2, 0],
  2: [1, 1, 2, 0, 0, 2, 1, 1, 2, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 2, 0, 1, 2, 1, 1, 1, 2, 0, 2, 1],
  3: [2, 2, 1, 0, 2, 2, 0, 1, 0, 2, 1, 0, 1, 2, 2, 1, 0, 1, 0, 0, 1, 2, 0, 2, 2, 1, 0, 1, 2, 0]
};

const failures = [];
for (const question of sandbox.auditedQuestions) {
  const wanted = expected[question.source]?.[question.number - 1];
  if (question.answer !== wanted) {
    failures.push({
      id: question.id,
      actual: question.choices[question.answer],
      expected: question.choices[wanted]
    });
  }
}

const summary = {
  questions: sandbox.auditedQuestions.length,
  imageQuestions: sandbox.auditedQuestions.filter(item => item.image).length,
  textOnlyQuestions: sandbox.auditedQuestions.filter(item => !item.image).length,
  bilingualExplanations: sandbox.auditedQuestions.filter(item => item.explanation?.en && item.explanation?.vi && item.explanation?.section).length,
  failures
};

console.log(JSON.stringify(summary, null, 2));
if (summary.questions !== 95 || summary.imageQuestions !== 30 || summary.bilingualExplanations !== 95 || failures.length) process.exit(1);
