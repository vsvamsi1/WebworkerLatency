import React,{useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { REDUX_ACTIONS } from '../saga/allWorkers';


const App = () =>{
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: REDUX_ACTIONS.APP_START });
  }, [dispatch]);
 return ( 
 <div>
    <h1>Web Worker POC testing latency of roundtrip transfer of payload</h1>
    <h2>In this POC we can test how the main thread tasks interfers with webworker evaluation from completing</h2>
    <h2>Large array</h2>

    <button onClick={()=>{
        dispatch({ type: REDUX_ACTIONS.WORKER1 });

      }}>
      Trigger postMessage worker
    </button>
    <button onClick={()=>{
        dispatch({ type: REDUX_ACTIONS.WORKER2 });

      }}>
      Trigger ArrayBuffer worker
    </button>
    <h2>Large strings</h2>
    <button onClick={()=>{
        dispatch({ type: REDUX_ACTIONS.WORKER1, isLargeString: true });

      }}>
      Trigger postMessage worker
    </button>
    <button onClick={()=>{
        dispatch({ type: REDUX_ACTIONS.WORKER2, isLargeString: true });

      }}>
      Trigger ArrayBuffer worker
    </button>
    <div/>
    <div style={{marginTop:"10px"}}/>
    <button onClick={()=>{
        dispatch({ type: REDUX_ACTIONS.WORKER3 });

      }}>
      Trigger transfer of sharedArrayBuffer
    </button>
    <button onClick={()=>{
        dispatch({ type: REDUX_ACTIONS.WORKER4 });

      }}>
      Trigger transfer of sharedArrayBuffer
    </button>
    <h2>Click on the button below to make the main thread busy</h2>

      <div />
    <button onClick={()=>{
         console.time("makeMainThreadBusy");
         let i = 0;
         while(i<4000000000){
             i++;
         }
         console.timeEnd("makeMainThreadBusy");

      }}>
      Make Main Thread Busy
      </button>
  </div>)
}



export default App;
