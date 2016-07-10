import React from 'react';
import ReactDOM from 'react-dom';

import actions from './components/actions.js';
import manager from './components/store.js';

import Counter from './components/counter.js';

import '../sass/main.scss';

const root = document.querySelector('.container');

manager.initStore();
const store = manager.getStore();

const render = () => {
    ReactDOM.render(
        <Counter
            counter={store.getState()}
            onIncrement={actions.onIncrement}
            onDecrement={actions.onDecrement} />,
        root
    );
}

store.subscribe(render);
render();
