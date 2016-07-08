import React from 'react';
import moment from 'moment';


class ToggleForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleProjectChange = this.handleProjectChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleBillableChange = this.handleBillableChange.bind(this);
        this.handleTrack = this.handleTrack.bind(this);
    }

    handleProjectChange(e) {
        let value = e.target.value;
        this.props.onProjectChanged(value);
    }

    handleDescriptionChange(e) {
        let value = e.target.value;
        this.props.onDescriptionChanged(value);
    }

    handleBillableChange(e) {
        let value = e.target.checked;
        this.props.onBillableChanged(value);
    }

    handleTrack() {
        if (this.props.start) {
            this.props.onStop();
        } else {
            this.props.onStart();
        }
    }

    render() {
        let buttonClass = "pure-button button-success";
        let buttonLabel = "Start";
        let duration = "0:00:00";

        if (this.props.start) {
            buttonClass = "pure-button button-error";
            buttonLabel = "Stop";
            let d = moment.duration(this.props.elapsed);
            duration = Math.floor(d.asHours()) + moment.utc(d.asMilliseconds()).format(":mm:ss");
        }

        return (
            <div className="pure-g">
                <div className="pure-u-3-8">
                    <input
                        className="pure-u-23-24"
                        type="text"
                        placeholder="insert project"
                        value={this.props.project}
                        onChange={this.handleProjectChange} />
                </div>
                <div className="pure-u-3-8">
                    <input
                        className="pure-u-23-24"
                        type="text"
                        placeholder="insert description"
                        value={this.props.description}
                        onChange={this.handleDescriptionChange} />
                </div>
                <div className="pure-u-1-8">
                    <input
                        className="pure-checkbox"
                        type="checkbox"
                        checked={this.props.billable}
                        onChange={this.handleBillableChange} />
                </div>
                <div className="pure-u-1-8">
                    <div className="pure-u-1-2">
                        <p>{duration}</p>
                    </div>

                    <div className="pure-u-1-2">
                        <button className={buttonClass} onClick={this.handleTrack}>{buttonLabel}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ToggleForm;
