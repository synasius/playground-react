import { createStore } from 'redux';
import reducer from './reducers.js';

let Store = null;

const initStore = () => {
    Store = createStore(reducer);
}

const getStore = () => {
    return Store;
}

export default {
    initStore,
    getStore
}
