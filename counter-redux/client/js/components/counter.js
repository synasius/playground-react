import React from 'react';

class Counter extends React.Component {
    render() {
        return (
            <div className="row counter">
                <h3>Counter</h3>
                <p>{this.props.counter}</p>
                <button onClick={this.props.onIncrement}>+</button>
                <button onClick={this.props.onDecrement}>-</button>
            </div>
        );
    }
}

export default Counter;
