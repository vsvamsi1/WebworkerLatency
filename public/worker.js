// Workers do not have access to log.error
/* eslint-disable no-console */

const heavyWebworkerComputation =  (body) => {
  
  let i = 0;
  while (i < 4000000000) {
    i++;

  }
  
  const largePayload = [];
  i = 0;
  while(i<100000){
    largePayload.push({name: "vams", address:{ city: "hyd"}, age: 23, address: "hyd"});
    i++
  }

  return largePayload;
}

//TODO: Create a more complete RPC setup in the subtree-eval branch.
function syncRequestMessageListener(e) {
  console.log("see here ", e);
  const { messageType } = e.data;
  if (messageType !== "REQUEST") return;
  const startTime = Date.now();
  const { body, messageId } = e.data;
  const { method } = body;
  if (!method) return;
  const messageHandler = heavyWebworkerComputation;
  if (typeof messageHandler !== "function") return;
  console.time("webworker_"+messageId);
  const responseData = messageHandler(body);
  console.timeEnd("webworker_"+messageId);

  const endTime = Date.now();
  console.time("webworker_post_"+messageId);

  self.postMessage({
    messageId,
    messageType: "RESPONSE",
    body: { data: responseData, startTime, endTime },
  });
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
