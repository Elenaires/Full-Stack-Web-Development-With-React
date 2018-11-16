import React, { Component } from 'react';
import { Card, CardImg, CardImgOverlay, CardText, CardBody, CardTitle } from 'reactstrap';

class Dishdetail extends Component {

    constructor(props){
        super(props);

        this.state = {
        }

    }

    renderComment(comments){
        if(comments != null) {
            const feedback = comments.map((commentBlock) => {
                return (
                    <ul>
                        <li key={commentBlock.id}>
                            <p>{commentBlock.comment}</p>
                            <p>-- {commentBlock.author}, {commentBlock.date}</p>
                        </li>
                    </ul>
                );
            });

            return (
                <div className="col-md m-1">
                    <h4>Comments</h4>
                    {feedback}
                </div>
            );
        }
        else    
        {
            return(
                <div></div>
            ); 
        }
    }

    renderDish(dish) {
        if(dish != null) {
            return (
                <div key={dish.id} className="col-12 col-md-5 m-1">
                    <Card>
                        <CardImg width="100%" src={dish.image} alt={dish.name}/>
                        <CardBody>
                            <CardTitle>{dish.name}</CardTitle>
                            <CardText>{dish.description}</CardText>
                        </CardBody>       
                    </Card>
                </div>  
            );
        }
        else{
            return(
                <div></div>
            );
        }     
    }

    render() {
        var dish = this.props.dish;
     
        return (
            <div className="row">  
                {this.renderDish(dish)}
                {dish == null ? (this.renderComment(null)) : (this.renderComment(dish.comments))}
            </div>
        );
    }
}

export default Dishdetail;