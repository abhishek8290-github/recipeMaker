const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const path = require('path');

const rateLimit = require('express-rate-limit');

const openai_make_recipe_limit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5 // limit each IP to 50 requests per windowMs
});

const normal_rate_limit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20 // limit each IP to 50 requests per windowMs
});



const logger = require('./middleware/logger');

const cors = require('cors');
const httpStatus = require('http-status');

const recipe_route = require('./routes/recipe_route');
const auth_route = require('./routes/auth_route');
const make_recipe_route = require('./routes/make_recipe');
// const config = require('./config/config');
const ApiError = require('./utils/ApiError');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));


app.use(helmet()); // set security HTTP headers
app.use(express.json()); // parse json request body
app.use(express.urlencoded({ extended: true })); // parse urlencoded request body
app.use(xss()); // sanitize request data
app.use(mongoSanitize());
app.use(compression()); // gzip compression
app.use(cors()); // enable cors
app.options('*', cors());


app.get('/', (req, res) => {
    res.send('This is working fine ');
});

app.get('/healthcheck', (req, res) => {
  res.send('This is working fine ');
});

app.use('/make', openai_make_recipe_limit, make_recipe_route);

app.use('/recipe',normal_rate_limit, recipe_route);

app.use('/auth',normal_rate_limit, auth_route);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  logger.log('error', '404 Not Found');
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
// app.use(errorConverter);

// // handle error
// app.use(errorHandler);




module.exports = app;