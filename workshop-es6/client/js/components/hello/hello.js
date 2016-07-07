import React from 'react';
import styles from './hello.scss';

class HelloComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { text: this.props.initialText };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(element) {
        let value = element.target.value;
        this.setState({ text: value });
    }

    render() {
        return (
            <div className="form-controller">
                <input
                    className={styles.root}
                    type="text"
                    placeholder="insert text..."
                    value={this.state.text}
                    onChange={this.handleChange} />
            </div>
        );
    }
};

export default HelloComponent;
