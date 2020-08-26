import React, { Component } from 'react';
import {
    Container, ListGroup, ListGroupItem, Button,
    Card, CardText, CardBody, CardHeader
} from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { connect } from 'react-redux';
import { getHaikus, deleteHaiku, addHaiku } from '../actions/haikuActions';
import PropTypes from 'prop-types';

class HaikuList extends Component {

    componentDidMount() {
        this.props.getHaikus();
    };

    onDeleteClick = _id => {
        this.props.deleteHaiku(_id);
    };

    render() {
        const { haikus } = this.props.haiku;
        return (
            <Container>
                <ListGroup>
                    <TransitionGroup className="haiku-list">
                        {haikus.map(({ _id, title, line1, line2, line3 }) => (
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
                                            <Button
                                                className="upVote-btn"
                                                color="primary"
                                            >
                                                <FaThumbsUp />
                                            </Button>
                                            <Button
                                                className="remove-btn"
                                                color="danger"
                                                onClick={this.onDeleteClick.bind(this, _id)}
                                            >
                                                < FaThumbsDown />
                                            </Button>
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

HaikuList.propTypes = {
    getHaikus: PropTypes.func.isRequired,
    deleteHaiku: PropTypes.func.isRequired,
    addHaiku: PropTypes.func.isRequired,
    haiku: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    haiku: state.haiku
});

export default connect(mapStateToProps, { getHaikus, deleteHaiku, addHaiku })(HaikuList);