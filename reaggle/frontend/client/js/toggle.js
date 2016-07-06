var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var moment = require('moment');

var ToggleEntry = React.createClass({
    handleStart: function() {
        // ask parent to start tracking
        this.props.onStart({
            description: this.props.entry.description,
            project: this.props.entry.project,
            billable: this.props.entry.billable,
            start: Date.now(),
        });
    },

    render: function() {
        var from_date = moment(this.props.entry.from_date);
        var to_date = moment(this.props.entry.to_date);
        var d = moment.duration(to_date.diff(from_date));
        var duration = Math.floor(d.asHours()) + moment.utc(d.asMilliseconds()).format(":mm:ss");

        if (this.props.entry.billable) {
            var billable = <p><strong>$</strong></p>
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
});

var ToggleForm = React.createClass({
    handleDescriptionChange: function(e) {
        var value = e.target.value;
        this.props.onDescriptionChanged(value);
    },

    handleProjectChange: function(e) {
        var value = e.target.value;
        this.props.onProjectChanged(value);
    },

    handleBillableChange: function(e) {
        var value = e.target.checked;
        this.props.onBillableChanged(value);
    },

    handleTrack: function() {
        if (this.props.start) {
            this.props.onStop();
        } else {
            this.props.onStart();
        }
    },

    render: function() {
        var buttonClass = "pure-button button-success";
        var buttonLabel = "Start";
        var duration = "0:00:00";

        if (this.props.start) {
            var buttonClass = "pure-button button-error";
            var buttonLabel = "Stop";
            var d = moment.duration(this.props.elapsed);
            var duration = Math.floor(d.asHours()) + moment.utc(d.asMilliseconds()).format(":mm:ss");
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
});

var ToggleList = React.createClass({
    render: function() {
        var entries = this.props.items.map(function(entry) {
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
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        // reasonable because properties /states are immutable;
        // you may decide to enforce the behavior using immutable.js
        return this.props.items !== nextProps.items;
    }
});

var Toggle = React.createClass({
    getInitialState: function() {
        return {
            data: [],

            description: "",
            project: "",
            billable: false,
            start: null,
            elapsed: 0,
        };
    },

    componentDidMount: function() {
        this.fetchEntries();
    },

    fetchEntries: function() {
        $.ajax({
            url: this.props.apiRoot,
            success: function(data) {
                this.setState({ data: data });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    },

    saveEntry: function(entry) {
        var oldEntries = this.state.data;
        entry.id = Date.now();

        var newEntries = oldEntries.slice(0);
        newEntries.unshift(entry);
        this.setState({ data: newEntries });

        $.ajax({
            url: this.props.apiRoot,
            type: "POST",
            data: entry,
            error: function() {
                this.setState({ data: oldEntries });
            }.bind(this)
        });
    },

    onStartFromEntry: function(entry) {
        this.setState({
            description: entry.description,
            project: entry.project,
            billable: entry.billable,
            start: Date.now(),
            elapsed: 0
        });
        this.timer = setInterval(this.tick, 1000);
    },

    onStart: function() {
        this.setState({ start: Date.now(), elapsed: 0 });
        this.timer = setInterval(this.tick, 1000);
    },

    onStop: function() {
        // save before state is cleaned
        var entry = {
            description: this.state.description,
            project: this.state.project,
            billable: this.state.billable,
            from_date: moment(this.state.start).format(),
            to_date: moment(Date.now()).format(),
        };
        this.saveEntry(entry);

        // clean the state
        this.setState({ description: "", project: "", billable: false, start: null, elapsed: 0 });
        clearInterval(this.timer);
    },

    tick: function() {
        this.setState({ elapsed: Date.now() - this.state.start });
    },

    onDescriptionChanged: function(value) {
        this.setState({ description: value });
    },

    onProjectChanged: function(value) {
        this.setState({ project: value });
    },

    onBillableChanged: function(value) {
        this.setState({ billable: value });
    },

    render: function() {
        return (
            <div className="entries-list">
                <ToggleForm
                    description={this.state.description}
                    project={this.state.project}
                    billable={this.state.billable}
                    start={this.state.start}
                    elapsed={this.state.elapsed}

                    onDescriptionChanged={this.onDescriptionChanged}
                    onProjectChanged={this.onProjectChanged}
                    onBillableChanged={this.onBillableChanged}

                    onStop={this.onStop}
                    onStart={this.onStart} />

                <ToggleList items={this.state.data} onStartFromEntry={this.onStartFromEntry} />
            </div>
        );
    }
});

ReactDOM.render(
    <Toggle
        apiRoot="https://reaggle.herokuapp.com/api/entries/"
        interval="2000" />,
    document.getElementById('content')
);
