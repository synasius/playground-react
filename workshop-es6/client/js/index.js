import React from 'react';
import ReactDOM from 'react-dom';
import HelloComponent from './components/hello/hello.js';

import '../sass/main.scss';

const root = document.querySelector('.container');

ReactDOM.render(
    <HelloComponent initialText="boooo" />,
    root
);
