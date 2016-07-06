var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var moment = require('moment');
require("moment-duration-format");

var PostContent = React.createClass({
    render: function() {
        var fromNow = moment(this.props.date).fromNow();
        var nsfw = this.props.nsfw ? "NSFW" : "";

        // render the image only when src is not empty
        var image = this.props.image ? <img src={this.props.image} /> : null;

        return (
            <div className="post-element post-content">
                <div className="post-image">
                    {image}
                </div>
                <div className="post-element post-detail">
                    <h1 className="post-element post-title">
                        <a href={this.props.url}>{this.props.title}</a>
                    </h1>
                    <p className="post-element post-tag">{nsfw}</p>
                    <p>submitted {fromNow}</p>
                </div>
            </div>
        );
    }
});

var PostVotes = React.createClass({
    getInitialState: function() {
        return { vote: "novote" };
    },

    handleVoteUp: function() {
        if (this.state.vote === "downvote") {
            // if the post was downvoted we should update both votes and downvotes
            this.setState({ vote: "upvote" });
            // here we tell the parent to add an upvote and remove a downvote
            this.props.onVoteUpdate(1, -1);
        } else {
            // otherwise we toggle the upvote state
            if (this.state.vote === "upvote") {
                this.setState({ vote: "novote" });
                this.props.onVoteUpdate(-1, 0);
            } else {
                this.setState({ vote: "upvote" });
                this.props.onVoteUpdate(1, 0);
            }
        }
    },

    handleVoteDown: function() {
        if (this.state.vote === "upvote") {
            // if the post was upvoted we should update both upvotes and downvotes
            this.setState({ vote: "downvote" });
            // here we tell the parent to add an upvote and remove a downvote
            this.props.onVoteUpdate(-1, 1);
        } else {
            // otherwise we toggle the upvote state
            if (this.state.vote === "downvote") {
                this.setState({ vote: "novote" });
                this.props.onVoteUpdate(0, -1);
            } else {
                this.setState({ vote: "downvote" });
                this.props.onVoteUpdate(0, 1);
            }
        }
    },

    render: function() {
        var points = this.props.upvotes - this.props.downvotes;

        return (
            <div className="post-element post-votes">
                <input type="button" value="up" onClick={this.handleVoteUp} />
                <h2>{points}</h2>
                <input type="button" value="down" onClick={this.handleVoteDown} />
            </div>
        );
    }
});

var ToggleEntry = React.createClass({
    render: function() {
        var from_date = moment(this.props.entry.from_date);
        var to_date = moment(this.props.entry.to_date);
        var duration = moment.duration(to_date.diff(from_date)).format("h:mm:ss");

        if (this.props.entry.billable) {
            var billable = <p>billable</p>
        }

        return (
            <div className="entry-main">
                <h2>{this.props.entry.project}</h2>
                <p>{this.props.entry.description}</p>
                <p>{duration}</p>
                {billable}
            </div>
        );
    }
});

var ToggleForm = React.createClass({
    handleTitleChange: function(e) {
        var value = e.target.value;
        this.setState({ title: value });
    },

    handleLinkChange: function(e) {
        var value = e.target.value;
        this.setState({ url: value });
    },

    handleImageChange: function(e) {
        var value = e.target.value;
        this.setState({ image: value });
    },

    handleNsfwChange: function(e) {
        var value = e.target.checked;
        this.setState({ nsfw: value });
    },

    handleSubmit: function(e) {
        e.preventDefault();
        if (!this.state.title) {
            return;
        }

        var data = {
            title: this.state.title,
            url: this.state.url,
            image: this.state.image,
            nsfw: this.state.nsfw,
            upvotes: 0,
            downvotes: 0
        };

        this.props.onPublishPost(data);

        this.setState(this.getInitialState());
    },

    render: function() {
        return (
            <form className="post-form" onSubmit={this.handleSubmit} >
                <input
                    type="text"
                    placeholder="insert title"
                    value={this.state.title}
                    onChange={this.handleTitleChange} />
                <input
                    type="url"
                    placeholder="insert link"
                    value={this.state.url}
                    onChange={this.handleLinkChange} />
                <input
                    type="url"
                    placeholder="insert image link"
                    value={this.state.image}
                    onChange={this.handleImageChange} />
                <label>
                    <input
                        type="checkbox"
                        checked={this.state.nsfw}
                        onChange={this.handleNsfwChange} />
                    NSFW
                </label>
                <input type="submit" value="Publish" />
            </form>
        );
    }
});

var Toggle = React.createClass({
    getInitialState: function() {
        return { data: [] };
    },

    componentDidMount: function() {
        this.fetchEntries();
        setInterval(this.fetchEntries, this.props.interval);
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

    onSaveEntry: function(entry) {
        var oldEntries = this.state.data;
        entry.id = Date.now();

        var newEntries = oldEntries.concat([entry]);
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

    render: function() {
        var entries = this.state.data.map(function(entry) {
            return (
                <ToggleEntry
                    key={entry.id}
                    entry={entry} />
            );
        }.bind(this));

                //<ToggleForm onSaveEntry={this.onSaveEntry} />
        return (
            <div className="entries-list">
                {entries}
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
