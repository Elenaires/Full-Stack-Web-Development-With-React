import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Label, Row, Col  } from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';

// checks that value is greater than 0
const required = (val) => val && val.length;

// function of function
const maxLength = (len) => (val) => !(val) || (val.length <= len);

const minLength = (len) => (val) => (val) && (val.length >= len);

class CommentForm extends Component {

    constructor(props){
        super(props);

        this.state = {
            isModalOpen: false
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.handleComment = this.handleComment.bind(this);
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleComment(values){
        this.toggleModal();
        //console.log("Current State is: " + JSON.stringify(values));
        //alert("Current State is: " + JSON.stringify(values));
        this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);
    }


    render() {
        return (
            <React.Fragment>
                <Button outline color="secondary" onClick={this.toggleModal}>
                    <i className="fa fa-pencil"></i> Submit Comment
                </Button> 

                {/* toggle - so that when we click outside of the modal the form disappear */}
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    {/* toggle - so that an 'x' appears in the header and we can dismiss the form */}
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleComment(values)}>
                            <Row className="form-group">
                                <Label htmlFor="rating" xs={12}>Rating</Label>
                                <Col>
                                    <Control.select model=".rating" id="rating" name="rating"
                                        className="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="author" xs={12}>Your Name</Label>
                                <Col>
                                    <Control.text model=".author" id="author" name="author"
                                        placeholder="Your Name" 
                                        className="form-control"
                                        validators={{
                                            required, minLength: minLength(3), maxLength: maxLength(15)
                                        }}
                                        />
                                    <Errors
                                        className="text-danger"
                                        model=".name"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters of less'
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="comment" xs={12}>Comment</Label>
                                <Col>
                                    <Control.textarea model=".comment" id="comment" name="comment"
                                        rows="6" 
                                        className="form-control"/>
                                </Col>
                            </Row>
                            {/* as long as button appears within LocalForm, it will syn with onSubmit */}
                            <Row className="form-group">
                                <Col xs={{size: 12}}>
                                    <Button type="submit" color="primary">
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>  
            </React.Fragment>        
        );
    }   
}

export default CommentForm;
