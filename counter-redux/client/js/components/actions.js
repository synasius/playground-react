import manager from './store.js';

const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';

const onIncrement = () => {
    const store = manager.getStore();
    store.dispatch({
        type: INCREMENT
    });
};

const onDecrement = () => {
    const store = manager.getStore();
    store.dispatch({
        type: DECREMENT
    });
};

export default {
    INCREMENT,
    DECREMENT,
    onIncrement,
    onDecrement
};
