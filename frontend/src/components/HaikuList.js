import React, { Component } from 'react';
import {
    Container, ListGroup, ListGroupItem, Button,
    Card, CardText, CardBody, CardHeader
} from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { connect } from 'react-redux';
import { getHaikus, deleteHaiku, addHaiku, upVote } from '../actions/haikuActions';
import PropTypes from 'prop-types';

class HaikuList extends Component {

    componentDidMount() {
        this.props.getHaikus();
    };

    static propTypes = {
        getHaikus: PropTypes.func.isRequired,
        deleteHaiku: PropTypes.func.isRequired,
        addHaiku: PropTypes.func.isRequired,
        upVote: PropTypes.func.isRequired,
        haiku: PropTypes.object.isRequired,
        isAuthenticated: PropTypes.bool
    };

    onDeleteClick = _id => {
        this.props.deleteHaiku(_id);
    };

    onUpVoteClick = _id => {
        console.log('upvote clicked');
        this.props.upVote(_id);
        window.location.reload();
    }

    render() {
        const { haikus } = this.props.haiku;
        return (
            <Container>
                <ListGroup>
                    <TransitionGroup className="haiku-list">
                        {haikus.map(({ _id, title, line1, line2, line3, numberOfLikes }) => (
                            <CSSTransition key={_id} timeout={500} classNames="fade">
                                <ListGroupItem>
                                    <Card>
                                        <CardHeader tag="h4">{title}</CardHeader>
                                        <CardBody>
                                            <CardText>
                                                <blockquote className="blockquote mb-0">
                                                    {line1}<br />
                                                    {line2}<br />
                                                    {line3}
                                                    <footer className="blockquote-footer text-right">
                                                        <cite>anonymous</cite>
                                                    </footer>
                                                </blockquote>
                                            </CardText>
                                            {this.props.isAuthenticated ?
                                                <Button
                                                    className="upVote-btn"
                                                    color="primary"
                                                    onClick={this.onUpVoteClick.bind(this, _id)}
                                                >
                                                    <FaThumbsUp />
                                                </Button>
                                                : null}
                                            <span className="ml-3">
                                                {numberOfLikes} {numberOfLikes === 1 ? 'reader' : 'readers'} liked this
                                                </span>
                                        </CardBody>
                                    </Card>
                                </ListGroupItem>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </ListGroup>
            </Container>
        )
    }
}

const mapStateToProps = (state) => ({
    haiku: state.haiku,
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { getHaikus, deleteHaiku, addHaiku, upVote })(HaikuList);