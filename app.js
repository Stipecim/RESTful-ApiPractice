const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, PATCH, GET');
        return res.status(200).json({});
    }
    next();

});

// routes that handle requests
app.use('/products', productRoutes);
app.use('/order', orderRoutes);
app.use('/user', userRoutes);

// Error handling if we dont specifly existing rout we will get an error
// we crate new object Error and by assigning it with new keywoard to error variable
// then we give it a status 404 - which means not found 
// then error gets passed with function called next that initiates next function in row
app.use((req, res, next) => {
    const error = new Error('Route Not found');
    error.status = 404;
    next(error); // error gets passed to a next function 
});

// now it sets request status as error status
// if error is not assigned we set error 500 witch means(intarnal server error)
app.use((error, req, res, next) => {
   res.status(error.status || 500);
   res.json({
    error: {
        message: error.message
    }
   })
});
module.exports = app;

