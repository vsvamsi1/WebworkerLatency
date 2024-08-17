import { all, call, takeEvery, takeLatest } from "redux-saga/effects";
import { evalWorker1, evalWorker2, evalWorker3, evalWorker4 } from "../saga/orchestrator";

const largePayload = [];
let i = 0;
while(i<400000){
  largePayload.push({name: "vams", address:{ city: "hyd", hi:{name: "vams", address:{ city: "hyd",hi:{name: "vams", address:{ city: "hyd"}, age: 23}}, age: 23}}, age: 23});
  i++
}
const largeSerialisedPayload = JSON.stringify(largePayload);

const getPayload = (isLargeString) => {

  return isLargeString?largeSerialisedPayload: largePayload;
}
export function* triggerWorker1({isLargeString}) {

  // const str = JSON.stringify(getPayload(isLargeString));
  // console.log("start 1 start",str);
  console.time("postMessageTransaction");
  const resp = yield call(evalWorker1.request, "POST_MESSAGE_REGULAR", getPayload(isLargeString));
  console.timeEnd("postMessageTransaction");
  return resp;
}

const convertToArrayBuffer = (data) => {
  const jsonString = JSON.stringify(data);

  const encoder = new TextEncoder();
  const arrayBuffer = encoder.encode(jsonString).buffer;
  return arrayBuffer;
};
const convertArrayBufferToObject = (arrayBuffer) => {
  const decoder = new TextDecoder();

  const jsonStringFromBuffer = decoder.decode(new Uint8Array(arrayBuffer));
  const originalObject = JSON.parse(jsonStringFromBuffer);
  return originalObject;
};

const convertToSharedArrayBuffer = (data) => {
  // const jsonString = JSON.stringify(data);

  // // Step 2: Encode the JSON string to binary data using TextEncoder
  // const encoder = new TextEncoder();
  // const encodedData = encoder.encode(jsonString);
  
  // // Step 3: Create a SharedArrayBuffer with enough space for the encoded data
  // const sharedBuffer = new SharedArrayBuffer(encodedData.length);
  
  // // Step 4: Copy the encoded data into the SharedArrayBuffer
  // const sharedArray = new Uint8Array(sharedBuffer);
  // sharedArray.set(encodedData);
  // return sharedBuffer;
}
export function* triggerWorker2({isLargeString}) {
  console.log("see 2 start");

  console.time("arrayBufferTransaction");
  console.time("convertToArrayBuffer");
  const payload = getPayload(isLargeString)
  const arrayBuffer = convertToArrayBuffer(payload);
  console.timeEnd("convertToArrayBuffer");
  const resp = yield call(evalWorker2.request, "ARRAY_BUFFER", arrayBuffer, arrayBuffer);
  console.time("convertToObject");
  const obj = convertArrayBufferToObject(resp);
  console.timeEnd("convertToObject");
  console.timeEnd("arrayBufferTransaction");
  return obj
}
export function* triggerWorker3() {
  console.log("see 2 start");

  console.time("arrayBufferTransactionTransaction");
  console.time("convertToSharedArrayBuffer");
  const sharedArrayBuffer = convertToSharedArrayBuffer(largePayload);
  console.timeEnd("convertToSharedArrayBuffer");
  yield call(evalWorker2.request, "SHARED_BUFFER", sharedArrayBuffer);
  console.time("convertToObject");
  const obj = convertArrayBufferToObject(sharedArrayBuffer);
  console.timeEnd("convertToObject");
  console.timeEnd("arrayBufferTransaction");
  return obj
}
export function* triggerWorker4() {
  console.log("see 2 start");

  console.time("arrayBufferTransaction");
  console.time("convertToArrayBuffer");
  const arrayBuffer = convertToArrayBuffer(largePayload);
  console.timeEnd("convertToArrayBuffer");
  const resp = yield call(evalWorker2.request, "ARRAY_BUFFER", arrayBuffer);
  console.time("convertToObject");
  const obj = convertArrayBufferToObject(resp);
  console.timeEnd("convertToObject");
  console.timeEnd("arrayBufferTransaction");
  return obj
}



function* appStart() {
  yield all([
    call(evalWorker1.start), 
    call(evalWorker2.start),
    call(evalWorker3.start), 
    call(evalWorker4.start)
]);
}
export const REDUX_ACTIONS = {
  WORKER1: "WORKER1",
  WORKER2: "WORKER2",
  WORKER3: "WORKER3",
  WORKER4: "WORKER4",
  APP_START: "APP_START",
};
export function* rootSaga() {
  yield all([
    takeLatest(REDUX_ACTIONS.APP_START, appStart),
    takeEvery(REDUX_ACTIONS.WORKER1, triggerWorker1),
    takeEvery(REDUX_ACTIONS.WORKER2, triggerWorker2),
    takeEvery(REDUX_ACTIONS.WORKER3, triggerWorker3),
    takeEvery(REDUX_ACTIONS.WORKER4, triggerWorker4),

  ]);
}
