// Workers do not have access to log.error
/* eslint-disable no-console */
const convertToArrayBuffer = (data) => {
  const jsonString = JSON.stringify(data);

  // Step 2: Convert JSON string to ArrayBuffer
  const encoder = new TextEncoder();
  const arrayBuffer = encoder.encode(jsonString).buffer;
  return arrayBuffer;
};
const convertToEncodedString = (data) => {
  const jsonString = JSON.stringify(data);

  // Step 2: Convert JSON string to ArrayBuffer
  const encoder = new TextEncoder();
  const arrayBuffer = encoder.encode(jsonString);
  return arrayBuffer;
};
const convertArrayBufferToObject = (arrayBuffer) => {
  const decoder = new TextDecoder();

  const jsonStringFromBuffer = decoder.decode(new Uint8Array(arrayBuffer));
  const originalObject = JSON.parse(jsonStringFromBuffer);
  return originalObject;
};



const heavyWebworkerComputation =  (body) => {
  let i = 0;
  while (i < 100) {
    i++;

  }
  return body.data;
}

const heavyWebworkerComputationWithParsing =  (body) => {
  console.time("parsingToObjAtWorker");
  const parsedResp = convertArrayBufferToObject(body?.data)
  console.timeEnd("parsingToObjAtWorker");

  let i = 0;
  while (i < 100) {
    i++;

  }
  console.time("convertToArrayBufferAtWorker");
  const convertArrayBuffer = convertToArrayBuffer(parsedResp);
  console.timeEnd("convertToArrayBufferAtWorker");
  return convertArrayBuffer;
}

const heavyWebworkerComputationWithParsingSharedBuffer =  (body) => {
  console.time("parsingToObjAtWorker");
  const parsedResp = convertArrayBufferToObject(body?.data)
  console.timeEnd("parsingToObjAtWorker");

  let i = 0;
  while (i < 100) {
    i++;

  }
  const modified = parsedResp.map(v=>({...v, name:"sury"}));

  console.time("convertToArrayBufferAtWorker");
  const convertArrayString = convertToEncodedString(modified);
  sharedArray.set(convertArrayString);

  console.timeEnd("convertToArrayBufferAtWorker");
  return ;
}

const messageHandlerMap = {
  POST_MESSAGE_REGULAR: heavyWebworkerComputation,
  ARRAY_BUFFER: heavyWebworkerComputationWithParsing,
  SHARED_BUFFER : heavyWebworkerComputationWithParsingSharedBuffer,
};

function syncRequestMessageListener(e) {
  console.log("see here ", e);
  const { messageType } = e.data;
  if (messageType !== "REQUEST") return;
  const startTime = Date.now();
  const { body, messageId } = e.data;
  const { method } = body;  
  if (!method) return;
  const messageHandler = messageHandlerMap[
    method
  ]
  if (typeof messageHandler !== "function") return;
  console.time("webworker_"+messageId);
  const responseData = messageHandler(body);
  console.timeEnd("webworker_"+messageId);

  const endTime = Date.now();
  console.time("webworker_post_"+messageId);
  if("POST_MESSAGE_REGULAR"=== method){
  self.postMessage({
    messageId,
    messageType: "RESPONSE",
    body: { data: responseData, startTime, endTime },
  });
}else if ("ARRAY_BUFFER"=== method){
  self.postMessage({
    messageId,
    messageType: "RESPONSE",
    body: { data: responseData, startTime, endTime },
  },{ targetOrigin:"*", transfer: [responseData] });
}
else if ("SHARED_BUFFER"=== method){
  self.postMessage({
    messageId,
    messageType: "RESPONSE",
    body: { data: responseData, startTime, endTime },
  });
}
  console.timeEnd("webworker_post_"+messageId);

}

self.addEventListener("message", syncRequestMessageListener);

self.addEventListener("error", (e) => {
  e.preventDefault();
  console.error(e.message);
});

self.addEventListener("unhandledrejection", (e) => {
  e.preventDefault();
  // We might want to send this error to the main thread in the future.
  // console error will log the error to the logs tab against trigger field.
  console.error(e.reason.message);
});
