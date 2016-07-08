import React from 'react';
import $ from 'jquery';
import moment from 'moment';

import ToggleList from './toggle_list.js';
import ToggleForm from './toggle_form.js';


class Toggle extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],

            description: "",
            project: "",
            billable: false,
            start: null,
            elapsed: 0,
        };

        // bindings
        this.tick = this.tick.bind(this);
        this.onStartFromEntry = this.onStartFromEntry.bind(this);
        this.onStart = this.onStart.bind(this);
        this.onStop = this.onStop.bind(this);

        this.onProjectChanged = this.onProjectChanged.bind(this);
        this.onDescriptionChanged = this.onDescriptionChanged.bind(this);
        this.onBillableChanged = this.onBillableChanged.bind(this);
    }

    tick() {
        this.setState({ elapsed: Date.now() - this.state.start });
    }

    componentDidMount() {
        this.fetchEntries();
    }

    fetchEntries() {
        $.ajax({
            url: this.props.apiRoot,
            success: function(data) {
                this.setState({ data: data });
            }.bind(this)
        });
    }

    saveEntry(entry) {
        let oldEntries = this.state.data;
        entry.id = Date.now();

        let newEntries = oldEntries.slice(0);
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
    }

    onStartFromEntry(entry) {
        this.setState({
            description: entry.description,
            project: entry.project,
            billable: entry.billable,
            start: Date.now(),
            elapsed: 0
        });
        this.timer = setInterval(this.tick, 1000);
    }

    onStart() {
        this.setState({ start: Date.now(), elapsed: 0 });
        this.timer = setInterval(this.tick, 1000);
    }

    onStop() {
        // save before state is cleaned
        let entry = {
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
    }

    onProjectChanged(value) {
        this.setState({ project: value });
    }

    onDescriptionChanged(value) {
        this.setState({ description: value });
    }

    onBillableChanged(value) {
        this.setState({ billable: value });
    }

    render() {
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
}

export default Toggle;
