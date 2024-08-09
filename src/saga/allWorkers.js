import { all, call, takeEvery, takeLatest } from "redux-saga/effects";
import { evalWorker1, evalWorker2 } from "../saga/orchestrator";

const largePayload = [];

let i = 0;
while(i<1000){
  largePayload.push({name: "vams", age: 23});
  i++
}
export function* triggerWorker1() {
  console.log("start 1 start");


  const resp = yield call(evalWorker1.request, "SOME_METHOD_1", {
    someProperty: largePayload,
  });
  console.log("see 1", resp);
}
export function* triggerWorker2() {
  console.log("see 2 start");
  const resp = yield call(evalWorker2.request, "SOME_METHOD_1", {
    someProperty: "1",
  });
  console.log("see 2", resp);
}

function* appStart() {
  yield all([
    call(evalWorker1.start), 
    call(evalWorker2.start)
]);
}
export const REDUX_ACTIONS = {
  WORKER1: "WORKER1",
  WORKER2: "WORKER2",
  APP_START: "APP_START",
};
export function* rootSaga() {
  yield all([
    takeLatest(REDUX_ACTIONS.APP_START, appStart),
    takeEvery(REDUX_ACTIONS.WORKER1, triggerWorker1),
    takeEvery(REDUX_ACTIONS.WORKER2, triggerWorker2),
  ]);
}
