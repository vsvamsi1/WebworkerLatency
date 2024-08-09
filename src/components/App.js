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
    <button onClick={()=>{
        dispatch({ type: REDUX_ACTIONS.WORKER1 });

      }}>
      Trigger Worker 1
    </button>
    <button onClick={()=>{
        dispatch({ type: REDUX_ACTIONS.WORKER2 });

      }}>
      Trigger Worker 2
    </button>
    <div/>
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
