import * as ActionTypes from './ActionTypes';
import { DISHES } from '../shared/dishes';

// a function that creates and return an action object
export const addComment =  (dishId, rating, author, comment) => ({

    type: ActionTypes.ADD_COMMENT, 

    // javascript object that contains various parts of the comment
    payload: {
        dishId: dishId,
        rating: rating,
        author: author,
        comment: comment
    }
});

// a thunk (function that returns a function)
export const fetchDishes = () => (dispatch) => {
    dispatch(dishesLoading(true));

    setTimeout(() => {
        dispatch(addDishes(DISHES))
    }, 2000);
}

// returning object literals from arrow function in ecma6
export const dishesLoading = () => ({
    type: ActionTypes.DISHES_LOADING
});

export const dishesFailed = (errmess) => ({
    type: ActionTypes.DISHES_FAILED,
    payload: errmess
});

export const addDishes = (dishes) => ({
    type: ActionTypes.ADD_DISHES,
    payload: dishes
});
