var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var moment = require('moment');

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

var Post = React.createClass({
    getInitialState: function() {
        return {
            upvotes: this.props.initialUpvotes,
            downvotes: this.props.initialDownvotes
        };
    },

    onVoteUpdate: function(upvote, downvote) {
        var previousState = {
            upvotes: this.state.upvotes,
            downvotes: this.state.downvotes
        };
        var newState = {
            upvotes: this.state.upvotes + upvote,
            downvotes: this.state.downvotes + downvote
        };
        this.setState(newState);

        var url = this.props.apiRoot + this.props.post.id + "/";
        $.ajax({
            url: url,
            type: "PATCH",
            data: newState,
            error: function() {
                this.setState(previousState);
            }.bind(this)
        });
    },

    render: function() {
        return (
            <div className="post-main">
                <PostVotes
                    upvotes={this.state.upvotes}
                    downvotes={this.state.downvotes}
                    onVoteUpdate={this.onVoteUpdate} />
                <PostContent
                    title={this.props.post.title}
                    url={this.props.post.url}
                    date={this.props.post.date}
                    image={this.props.post.image}
                    nsfw={this.props.post.nsfw} />
            </div>
        );
    }
});

var RedditForm = React.createClass({
    getInitialState: function() {
        return { title: "", url: "", image: "", nsfw: false };
    },

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

var Reddit = React.createClass({
    getInitialState: function() {
        return { data: [] };
    },

    componentDidMount: function() {
        this.fetchPosts();
        setInterval(this.fetchPosts, this.props.interval);
    },

    fetchPosts: function() {
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

    onPublishPost: function(post) {
        var oldPosts = this.state.data;
        post.id = Date.now();

        var newPosts = oldPosts.concat([post]);
        this.setState({ data: newPosts });

        $.ajax({
            url: this.props.apiRoot,
            type: "POST",
            data: post,
            error: function() {
                this.setState({ data: oldPosts });
            }.bind(this)
        });
    },

    render: function() {
        var posts = this.state.data.map(function(post) {
            return (
                <Post
                    key={post.id}
                    apiRoot={this.props.apiRoot}
                    initialUpvotes={post.upvotes}
                    initialDownvotes={post.downvotes}
                    post={post} />
            );
        }.bind(this));

        return (
            <div className="posts-list">
                {posts}
                <RedditForm onPublishPost={this.onPublishPost} />
            </div>
        );
    }
});

ReactDOM.render(
    <Reddit
        apiRoot="https://evonove-react-rebbit.herokuapp.com/api/links/"
        interval="2000" />,
    document.getElementById('content')
);
