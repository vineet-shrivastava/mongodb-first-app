/**
 * loading modules
 */
const express = require('express');
/**
 * loading from core module
 */
const path = require('path');
/**
 * client inputs validator
 */
const Joi = require('joi');
/**
 * mongo client to talk to mongo db
 */
const mongojs = require('mongojs');

const app = express();
/**
 * loading db and collections
 */
const db = mongojs('customerapp', ['users']);
/**
 * mongo js ObjectId
 */
const ObjectId = mongojs.ObjectId;

/**
 * view engine
 */
app.set('view engine', 'ejs');
/**
 * setting views path
 */
app.set('views', path.join(__dirname, 'views'));

/**
 * custom middleware for logging - example
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
// const logger = (req, res, next) => {
//     console.log('Logging...');
//     next();
// };
// app.use(logger);

/**
 * middleware
 * for parsing of content to json in request body
 * for url encoding
 */
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

/**
 * setting static path
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * loading users from mongo db
 */
let users = [];
app.get('/', (req, res) => {
    db.users.find((err, docs) => {
        users = docs;
        res.render('index', {
            title: 'Express Mongoose App',
            users: users,
            errors: null
        });
    });
});

/**
 * adding a new user to mongo db
 * validations via JOI
 */
app.post('/users/add', (req, res) => {
    /**
     * validate user
     * object de-structuring [getting only the required properties in an object ]
     * equivalent to using result.error
     */
    const { error } = validateUser(req.body);
    if(error) {
        res.render('index', {
            title: 'Express Mongoose App',
            users: users,
            errors: error.details
        });
        return;
    }

    const newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email
    };
    db.users.insert(newUser, (err, doc) => {
        if(err) {
            console.log(err);
        }
        res.redirect('/');
    });
});

/**
 * deleting a user from mongo db
 */
app.delete('/users/delete/:id', (req, res) => {
    db.users.remove({
        _id: ObjectId(req.params.id)
    }, (err, result) => {
        if(err) {
            console.log(err);
        }
        res.redirect('/');
    });
});

/**
 * validating a user input
 * @param {*} user 
 */
function validateUser(user) {
    /**
     * creating a validation schema using JOI
     */
    const schema = {
        first_name: Joi.string().min(1).max(10).required(),
        last_name: Joi.string().min(1).max(15).required(),
        email: Joi.string().email().required()
    }
    return Joi.validate(user, schema);
}

/**
 * checking if a port is specified from outside
 * default port is 3000
 * export PORT=5000 [mac]
 * set PORT=5000 [windows]
 */
const port = process.env.PORT || 3000;
/**
 * server started and listening on port 3000
 */
app.listen(port, () => {
    console.log(`Listening on port ${port}..`);
});