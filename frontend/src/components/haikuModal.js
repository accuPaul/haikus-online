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

class haikuModal extends Component {
    state = {
        modal: false,
        title: '',
        line1: '',
        line2: '',
        line3: ''
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit = (e) => {
        e.preventDefault();
        const newHaiku = {
            title: this.state.title.length > 0 ? this.state.title : 'Untitled',
            line1: this.state.line1,
            line2: this.state.line2,
            line3: this.state.line3,
        }

        this.props.addHaiku(newHaiku);

        this.toggle();
    }
    render() {
        return (
            <div>
                <Button
                    color="dark"
                    style={{ marginBottom: '2rem' }}
                    onClick={this.toggle}
                ><FaEdit />Add Haiku</Button>

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
    haiku: state.haiku
})

export default connect(mapStateToProps, { addHaiku })(haikuModal)
