module.exports = (x,y,callback) => {
    if( x <= 0 || y <= 0) {
        // setTimeout takes a function and time of delay
        // simulate time delay eg. getting data from database
        setTimeout(() => 
            callback(new Error("Rectangle dimensions should be greater than zero"),
            null),
            2000);
    }
    else {
        setTimeout(() => 
            callback(null,
            {
                perimeter: () => (2*(x+y)),
                area: () => (x*y)
            }),
            2000);  
    }
}
 