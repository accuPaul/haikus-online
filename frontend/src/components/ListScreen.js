import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getHaikuList, deleteHaiku, addHaiku, upVote } from '../actions/haikuActions';
import PropTypes from 'prop-types';
import {
    Container, ListGroup, ListGroupItem, Button,
    Card, CardText, CardBody, CardHeader
} from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

class ListScreen extends Component {

    componentDidMount() {
        let list = 'haikus';
        let sort = '';
        if (this.props.location.listProps) {
            list = this.props.location.listProps.source;
            sort = this.props.location.listProps.sort;
            console.log('got this from location');
        }
        const path = list + (sort.length > 0 ? `/${sort}` : '');
        console.log(`Link to pass is ${path}`);
        this.props.getHaikuList(`${path}`);
    };

    static propTypes = {
        getHaikuList: PropTypes.func.isRequired,
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
                        {haikus.map(({ _id, title, line1, line2, line3, likers }) => (
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
                                                {likers.length} {likers.length === 1 ? 'reader' : 'readers'} liked this
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

export default connect(mapStateToProps, { getHaikuList, deleteHaiku, addHaiku, upVote })(ListScreen);