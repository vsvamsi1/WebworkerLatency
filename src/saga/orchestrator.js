import { GracefulWorkerService } from "../worker/webWorker";

export const evalWorker1 = new GracefulWorkerService(
  new Worker("./worker.js", {
    type: "module",
    // Note: the `Worker` part of the name is slightly important – LinkRelPreload_spec.js
    // relies on it to find workers in the list of all requests.
    name: "evalWorker1",
  })
);

export const evalWorker2 = new GracefulWorkerService(
  new Worker("./worker.js", {
    type: "module",
    // Note: the `Worker` part of the name is slightly important – LinkRelPreload_spec.js
    // relies on it to find workers in the list of all requests.
    name: "evalWorker2",
  })
);
