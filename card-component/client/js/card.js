var cards = [
    {
        id: 1,
        title: "Hello!",
        subtitle: "I'm a card",
        image: "https://static.guim.co.uk/sys-images/Technology/Pix/pictures/2009/7/24/1248433874260/Nuclear-Explosion-001.jpg",
        text: "some funny text about stuff",
        actions: [
            { id: 1, text: "Action 1" },
            { id: 2, text: "Action 2" }
        ],
    },
    {
        id: 2,
        title: "Foo Bar",
        subtitle: "no foo bar",
        image: "http://www.medicalnewstoday.com/content/images/articles/308/308796/mixed-fruits.jpg",
        text: "some boring text about stuff",
        actions: [
            { id: 1, text: "Action", data: "fava" }
        ],
    },
    {
        id: 3,
        title: "Hello Bar",
        subtitle: "no foo asdkjasdkjh",
        image: "",
        text: "some boring text about stuff",
        actions: [
            { id: 1, text: "Action 1" },
            { id: 2, text: "Action 2" },
            { id: 3, text: "Action 3" }
        ],
    },
    {
        id: 4,
        title: "Hello Foo",
        subtitle: "",
        text: "",
        actions: [
            { id: 1, text: "Action" }
        ],
    },
    {
        id: 5,
        title: "Hello empty",
    }
];

var CardHeader = React.createClass({
    render: function () {
        return (
            <div className="card-header">
                <h1>{this.props.title}</h1>
                <p>{this.props.subtitle}</p>
            </div>
        );
    }
});

var CardImage = React.createClass({
    render: function () {
        if (!this.props.image) {
            return null;
        }

        return (
            <div className="card-image">
                <img src={this.props.image} />
            </div>
        );
    }
});

var CardAction = React.createClass({
    handleActionClick: function() {
        this.props.onActionClicked(this.props.data);
    },

    render: function () {
        return (
            <input
                type="button"
                value={this.props.text}
                onClick={this.handleActionClick} />
        );
    }
});

var CardFooter = React.createClass({
    render: function () {
        if (this.props.actions) {
            var actions = this.props.actions.map(function(action) {
                return (
                    <CardAction
                        key={action.id}
                        text={action.text}
                        data={action.data}
                        onActionClicked={this.props.onActionClicked} />
                );
            }.bind(this));
        }

        return (
            <div className="card-footer">
                <p>{this.props.text}</p>
                <div className="card-actions">
                    {actions}
                </div>
            </div>
        );
    }
});

var Card = React.createClass({

    render: function () {
        return (
            <div className="card">
                <CardHeader
                    title={this.props.data.title}
                    subtitle={this.props.data.subtitle} />
                <CardImage image={this.props.data.image} />
                <CardFooter
                    text={this.props.data.text}
                    actions={this.props.data.actions}
                    onActionClicked={this.props.onActionClicked} />
            </div>
        );
    }
});

var CardsList = React.createClass({
    onActionClicked: function (data) {
        if (data) {
            console.log("action with data", data);
        } else {
            console.log("action with no data");
        }
    },

    render: function () {
        var cards = this.props.data.map(function(card) {
            return (
                <Card
                    key={card.id}
                    data={card}
                    onActionClicked={this.onActionClicked} />
            );
        }.bind(this));

        return (
            <div className="cards-list">
                {cards}
            </div>
        );
    }
});

ReactDOM.render(
    <CardsList data={cards} />,
    document.getElementById('content')
);
