import { createStore ,applyMiddleware} from 'redux';
import rootReducer from '../reducers';
import createSagaMiddleware from "redux-saga";
import { rootSaga } from '../saga/allWorkers';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export default store;