import React from 'react';
import moment from 'moment';


class ToggleList extends React.Component {
    render() {
        let entries = this.props.items.map(function(entry) {
            return (
                <ToggleEntry
                    key={entry.id}
                    entry={entry}
                    onStart={this.props.onStartFromEntry} />
            );
        }.bind(this));

        return (
            <div className="toggle-list">
                {entries}
            </div>
        );
    }

    shouldComponentUpdate(nextProps) {
        // reasonable because properties /states are immutable;
        // you may decide to enforce the behavior using immutable.js
        return this.props.items !== nextProps.items;
    }
}


class ToggleEntry extends React.Component {
    constructor(props) {
        super(props);

        this.handleStart = this.handleStart.bind(this);
    }

    handleStart() {
        // ask parent to start tracking
        this.props.onStart({
            description: this.props.entry.description,
            project: this.props.entry.project,
            billable: this.props.entry.billable,
            start: Date.now(),
        });
    }

    render() {
        let from_date = moment(this.props.entry.from_date);
        let to_date = moment(this.props.entry.to_date);
        let d = moment.duration(to_date.diff(from_date));
        let duration = Math.floor(d.asHours()) + moment.utc(d.asMilliseconds()).format(":mm:ss");

        let billable = "";
        if (this.props.entry.billable) {
            billable = <p><strong>$</strong></p>;
        }

        return (
            <div className="pure-g">
                <div className="pure-u-8-24">
                    <h2>{this.props.entry.project}</h2>
                </div>
                <div className="pure-u-8-24">
                    <p>{this.props.entry.description}</p>
                </div>
                <div className="pure-u-2-24">
                    {billable}
                </div>
                <div className="pure-u-4-24">
                    <p>{duration}</p>
                </div>
                <div className="pure-u-2-24">
                    <button onClick={this.handleStart}>Start</button>
                </div>
            </div>
        );
    }
}

export default ToggleList;
