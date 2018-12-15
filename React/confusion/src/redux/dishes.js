import * as ActionTypes from './ActionTypes';


// export reducer function
export const Dishes = (state = {
        isLoading: true, // initial true as there is no dishes, need to load data from somewhere, set to false once we obtain dishes information from somewhere
        errMess: null, // will be set with corresponding error msg when fetching failed
        dishes: [] // if fetching successful, load dishes in ADD_DISHES
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_DISHES:
            return {...state, isLoading: false, errMess: null, dishes: action.payload};

        /// ...state is a spread operator, take current value of state, create a copy and add modification based on the remaining parameter and return
        // state is immutable (not modifying original, we return new one)
        case ActionTypes.DISHES_LOADING:
            return {...state, isLoading: true, errMess: null, dishes: []};

        // fail to load dishes thus set isLoading to false
        // dishes array is empty as there is no dishes
        case ActionTypes.DISHES_FAILED:
            return {...state, isLoading: false, errMess: action.payload, dishes: []};


        default: 
            return state;
    }
}