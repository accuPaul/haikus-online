import React, { Component } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap';
import { connect } from 'react-redux';
import { FaEdit, FaSave } from 'react-icons/fa'
import { addHaiku } from '../actions/haikuActions';
import PropTypes from 'prop-types';


class HaikuModal extends Component {
    state = {
        modal: false,
        title: '',
        line1: '',
        line2: '',
        line3: '',
        author: '',
        canScramble: true,
        isScramble: false,
        visibleTo: ''
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        auth: PropTypes.object.isRequired,
        error: PropTypes.object.isRequired
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    onHandleCheckboxChange = (e) => {
        this.setState({ [e.target.name]: e.target.checked });
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit = (e) => {
        const { error } = this.props;
        e.preventDefault();
        console.log(`User = ${JSON.stringify(this.props.auth)}`)
        const newHaiku = {
            title: this.state.title.length > 0 ? this.state.title : 'Untitled',
            line1: this.state.line1,
            line2: this.state.line2,
            line3: this.state.line3,
            author: this.props.auth.user._id,
            canScramble: this.state.canScramble,
            access: this.state.access
        }

        this.props.addHaiku(newHaiku);

        if (error) {
            if (error.id === 'HAIKU_ERROR') {
                this.setState({ msg: error.msg.msg });
            } else { this.setState({ msg: null }); }
        }
        else {
            this.toggle();
        }

    }
    render() {
        return (
            <div>
                {this.props.isAuthenticated ?
                    <Button
                        color="dark"
                        style={{ marginBottom: '2rem' }}
                        onClick={this.toggle}
                    ><FaEdit />Add Haiku</Button>
                    : <h4 className="mb-3 ml-4">Log in to add your own haikus!</h4>}


                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                >
                    <ModalHeader toggle={this.toggle}>Write your Haiku</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for="haiku">Title (blank for Untitled)</Label>
                                <Input
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="Untitled"
                                    onChange={this.onChange}
                                />
                                <Label for="haiku">Three lines, 5-7-5...</Label>
                                <Input
                                    type="text"
                                    name="line1"
                                    id="line1"
                                    placeholder="Five syllables here"
                                    onChange={this.onChange}
                                />
                                <Input
                                    type="text"
                                    name="line2"
                                    id="line2"
                                    placeholder="Seven syllables go here"
                                    onChange={this.onChange}
                                />
                                <Input
                                    type="text"
                                    name="line3"
                                    id="line3"
                                    placeholder="Last five syllables"
                                    onChange={this.onChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Input type="checkbox" name="canScramble" id="scrambleCheck" onClick={this.onHandleCheckboxChange} />
                                <Label for="scrambleCheck" check>Allow to scramble?</Label><br />
                                <Label for="accessLevel">Choose Privacy for this haiku</Label>
                                <Input type="select" name="visibleTo" id="accessLevel">
                                    <option value="public">Public (anyone can see it)</option>
                                    <option value="private">Private (only you can see it</option>
                                    <option value="anonymous">Anonymous (public, but no names are listed)</option>
                                </Input>
                                <Button
                                    color="dark"
                                    style={{ marginTop: '2rem' }}
                                    block>
                                    <FaSave /> Save Haiku
                                </Button>

                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    haiku: state.haiku,
    isAuthenticated: state.auth.isAuthenticated,
    auth: state.auth
})

export default connect(mapStateToProps, { addHaiku })(HaikuModal)
