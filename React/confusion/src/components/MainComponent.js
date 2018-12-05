import React, { Component } from 'react';
import Home from './HomeComponent';
import Menu from './MenuComponent';
import About from './AboutComponent';
import Contact from './ContactComponent';
import DishDetail from './DishDetailComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
// withRouter is required for react component to connect to redux if we are using react router
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
// connect react application to redux store
import { connect } from 'react-redux';

// maps the states from the redux store to main componenat props
const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        promotions: state.promotions,
        leaders: state.leaders

    }
}

class Main extends Component {
    constructor(props){
        super(props);

        // states moved to reducer.js
        
    }

    render() {

        const HomePage = () => {
            return(
                <Home dish={this.props.dishes.filter((dish) => dish.featured)[0]}
                promotion={this.props.promotions.filter((promo) => promo.featured)[0]}
                leader={this.props.leaders.filter((leader) => leader.featured)[0]}/>
                
            );
        }

        const DishWithId = ({match}) => {
            return(
                <DishDetail dish={this.props.dishes.filter((dish) => dish.id === parseInt(match.params.dishId,10))[0]}
                    comments={this.props.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId,10))}
                />
            );
        }

        return (
            <div>
                <Header />
                <Switch>
                    <Route path="/home" component={HomePage} />
                    <Route exact path="/menu" component={() => <Menu dishes={this.props.dishes} />} />
                    <Route path="/menu/:dishId" component={DishWithId} />
                    <Route exact path="/aboutus" component={() => <About leaders={this.props.leaders}/>} />
                    <Route exact path="/contactus" component={Contact}/>
                    <Redirect to="/home" />
                </Switch>
                <Footer />
            </div>
        );
    }
}

// connects main component to redux store (withRouter is needed because we use react router)
export default withRouter(connect(mapStateToProps)(Main));
