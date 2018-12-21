var rect = require('./rectangle');

function solveRect(l,b) {
    console.log("Solving for reactangle with l= " + l + " and b = " + b);

    // the callback will only be executed after 2000ms delay
    rect(l,b, (err, rectangle) => {
        if(err) {
            console.log("ERROR: ", err.mesage);
        }
        else {
            console.log("The area is " + rectangle.area());
            console.log("The perimeter is " + rectangle.perimeter());
        }
    });
    console.log("This statement is after the call to rect()");
}

solveRect(2,4);
solveRect(3,5);