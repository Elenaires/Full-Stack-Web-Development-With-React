import * as ActionTypes from './ActionTypes';

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