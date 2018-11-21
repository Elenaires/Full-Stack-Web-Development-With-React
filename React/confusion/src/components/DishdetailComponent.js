import React from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom'

    function RenderComment({comments}){
            const feedback = comments.map((commentBlock) => {
                return (
                    <ul>
                        <li key={commentBlock.id}>
                            <p>{commentBlock.comment}</p>
                            <p>-- {commentBlock.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(commentBlock.date)))}</p>
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

    function RenderDish({dish}) {
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

    const DishDetail = (props) => {
 

        if(props.dish != null) {
            return (
                <div class="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem>
                            <Link to='/menu'>manu</Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            {props.dish.name}
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                     </div>
                </div>
                    <div className="row">  
                        <RenderDish dish={props.dish} />
                        <RenderComment comments={props.comments} />
                        {/*dish == null ? (this.renderComment(null)) : (this.renderComment(dish.comments))*/}
                    </div>
                </div>
            );
        }
        else {
            return (
                <div></div>
            );
        }   
    }


export default DishDetail;