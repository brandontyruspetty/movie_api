const express = require('express');
morgan = require('morgan');
bodyParser = require('body-parser');
uuid = require('uuid');

const { check, validationResult } = require('express-validator');

const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));

/** 
 * Added CORS for allowed domanins
 */
const cors = require('cors');
app.use(cors());

 let allowedOrigins = [
  'http://localhost:1234', 
  'http://localhost:4200',
  'https://mynoirmovies.herokuapp.com/',
  'https://mynoirmovies.netlify.app',
  'https://brandontyruspetty.github.io',

];

 app.use(cors({
     origin: (origin, callback) => {   
            if(!origin) return callback(null, true);
         if(allowedOrigins.indexOf(origin) === -1){
            //If a specific origin isn't found on the list of allowed origins
             let message = 'The CORS policy for this application really does not allow access from origin ' + origin;
             return callback(new Error(message), false);
         }
         return callback(null, true);
     }
 }));


 //Import authorization and JWT
let auth = require('./auth')(app);

//Importing Passport
const passport = require('passport');
require('./passport');

//mongoose.connect('mongodb://localhost:27017/myNoirMovies', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//added morgan for logging requests
app.use(morgan('common'));

/**
 * GET requests that return a welcom text response from '/' endpoint
 * @name welcomeMessage
 * @kind function
 * @returns welcome message
 */ 
app.get('/', (req, res) => {
    res.send('Welcome to my unusual and lesser known film noir favorites. Enjoy.');
});

/** 
 * GET a list of all movies to the user
* Request body: Bearer token
* @name getAllMovies
* @kind function
* @returns array of movie objects
* @requires passport
*/

app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

/**
 * GET data about a single movie by title
 * Request body: Bearer token
 * @name getMovie 
 * @kind function
 * @param _id
 * @returns json movie object
 * @requires passport
*/
app.get('/movies/:movieId', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ _id: req.params.movieId })
    .then((movie) => {
        res.status(201).json(movie);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

/** 
 * GET data about a genre by name
 * Request body: Bearer token
 * @name getGenre
 * @kind function
 * @param Name
 * @returns json genre object
 * @requires passport
*/
app.get('/movies/genre/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.Name })
    .then((movies) => {
        res.send(movies.Genre)
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + err);
    });
});

/**
 * GET data about a director by name
 * Request body: Bearer token
 * @name getDirector
 * @kind function
 * @param Name
 * @returns json director object
 * @requires passport
*/
app.get('/movies/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Name })
    .then((movies) => {
        res.send(movies.Director)
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + err)
    });
});

/**
 * POST a new user. Username, password, and email are all required fields
 * Request body: Bearer token
* {
*  ID: Integer, 
*  Username: String,
*  Password: String,
*  Email: String,
*  Birthday: Date
*  }
* @name createUser
* @kind function
* @returns json user object
*/
app.post('/users', 
[
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters -  not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()
        });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) //Search to see if a user with the requested username already exists
    .then((user) => {
        if (user) {
            //If the user is found, send a response that it already exists
            return res.status(400).send(req.body.Username + 'already exists');
            } else { 
                Users
                .create({
                    Username: req.body.Username,
                    Password: hashedPassword,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday
                })
                .then((user) => {res.status(201).json(user) })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error:' + error);
                })
            }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error:' + error);
    });
});

/**
 * PUT updated user info by username
 * {
 * Username: String, (required)
 * Password: String, (required)
 * Email: String, (required)
 * Birthday: Date
 * }
 * @name updatedUser
 * @kind function
 * @param Username
 * @returns json user object
 * @requires passport 
 */
app.put('/users/:Username', 
[
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters -  not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()
        });
    }
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $set:
    {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
    }
},
{ new: true }, 
(err, updatedUser) => {
    console.log('updated user:', updatedUser)
    if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    } else {
        if (!updatedUser) {
            return res.status(404).send()
        }
        res.json(updatedUser);
    }
    });
});

/**
 * POST a movie to a user's list of favorites
 * Request body: Bearer token
 * @name addToFavorites
 * @kind function
 * @param Username
 * @param MovieID
 * @returns json user object
 * @requires passport
 */
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => { 
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true },
    (err, updatedUser) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

/**
 * Allow users to DELETE a movie from list of favorites
 * Request body: Bearer token
 * @name deleteFavorite
 * @kind function
 * @param Username
 * @param MovieID
 * @returns json user object
 * @requires passort
*/
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: { FavoriteMovies: req.params.MovieID }
    },
    { new: true},
    (err, updatedUser) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});   


/**
 * Allow existing users to DELETE account by username
 * Request body: Bearer token
 * @name deleteUser
 * @kind function
 * @param Username
 * @returns success message
 * @requires passport
 * */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
        if (!user) {
            res.status(400).send(req.params.Username + ' was not found');
        } else {
            res.status(200).send(req.params.Username + ' was deleted.');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
  .then((user) => {
    if (!user) {
        return res.status(404).send()
    }
    res.json(user);
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
  });
});

//added express.static to access documentation.html
app.use(express.static('public'));

//added error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke.');
});

//replaced listener 
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
    console.log('Listening on Port ' + port);
});
