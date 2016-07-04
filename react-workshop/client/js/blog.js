var Item = React.createClass({
    rawMarkup: function() {
        var md = new Remarkable();
        var rawMarkup = md.render(this.props.children.toString());
        return { __html: rawMarkup };
    },

    render: function() {
        return (
            <div className="item">
                <h2>{this.props.author}</h2>
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
            </div>
        );
    }
});

var ItemList = React.createClass({
    render: function () {
        var comments = this.props.data.map(function(comment) {
            return (
                <Item key={comment.id} author={comment.author}>{comment.text}</Item>
            );
        });

        return (
            <div className="items-list">
                {comments}
            </div>
        );
    }
});

var CommentForm = React.createClass({
    getInitialState: function() {
        return { author: "", text: "" };
    },

    handleAuthorChange: function(e) {
        var value = e.target.value.toUpperCase();
        this.setState({ author: value });
    },

    handleTextChange: function(e) {
        var value = e.target.value;
        this.setState({ text: value });
    },

    handleSubmit: function(e) {
        e.preventDefault();
        var author = this.state.author;
        var text = this.state.text;

        // nothing to do when data is empty
        if (!author || !text) {
            return;
        }

        this.props.saveComment({ author: author, text: text });

        this.setState(this.getInitialState());
    },

    render: function () {
        return (
            <form className="comment-form" onSubmit={this.handleSubmit} >
                <input
                    type="text"
                    placeholder="insert author's name"
                    value={this.state.author}
                    onChange={this.handleAuthorChange} />
                <input
                    type="text"
                    placeholder="insert comment"
                    value={this.state.text}
                    onChange={this.handleTextChange} />
                <input type="submit" value="Post" />
            </form>
        );
    }
});

var CommentBox = React.createClass({
    getInitialState: function() {
        return { data: [] };
    },

    componentDidMount: function() {
        this.fetchComments();
        setInterval(this.fetchComments, this.props.interval);
    },

    fetchComments: function() {
        $.ajax({
            url: this.props.url,
            success: function(data) {
                this.setState({ data: data });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    },

    saveComment: function(comment) {
        var oldComments = this.state.data;
        comment.id = Date.now();

        var newComments = oldComments.concat([comment]);
        this.setState({ data: newComments });

        $.ajax({
            url: this.props.url,
            type: "POST",
            data: comment,
            error: function() {
                this.setState({ data: oldComments });
            }.bind(this)
        });
    },

    render: function () {
        return (
            <div>
                <h1>Comments</h1>
                <ItemList data={this.state.data} />
                <CommentForm saveComment={this.saveComment} />
            </div>
        );
    }
});

ReactDOM.render(
    <CommentBox url="https://evonove-react.herokuapp.com/api/comments" interval="2000" />,
    document.getElementById('content')
);
