const express = require('express');
morgan = require('morgan');
bodyParser = require('body-parser');
uuid = require('uuid');

const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));

mongoose.connect('mongodb://localhost:27017/myNoirMovies', { useNewUrlParser: true, useUnifiedTopology: true });


//added morgan for logging requests
app.use(morgan('common'));

//Get Requests that return a text response
app.get('/', (req, res) => {
    res.send('Welcome to my unusual and lesser known film noir favorites. Enjoy.');
});

//GET a list of all movies to the user
/*Expect a return of a json object containing data on movies*/
app.get('/movies', (req, res) => {
    Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//GET data about a single movie by title
/* Expect a return of json object containing data on single movie */
app.get('/movies/:Title', (req, res) => {
    Movies.findOne({ Movies: req.params.Movies })
    .then((movie) => {
        res.json(movie);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Get data about a genre by name/title
/*Expect a return of a json object containing data on a single genre by title */
app.get('/movies/:Genre/:genreName', (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.genreName })
    .then((movie) => {
        res.json(movie)
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + err);
    });
});

//GET data about a diretor by name
/*Expect a return of JSON object containing data about director*/
app.get('movies/:Director/:directorName', (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.directorName })
    .then((movie) => {
        res.status(201).json(movie.Director);
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + err)
    });
});

//Add a user
/* Expect JSON in this format
{
    ID: Integer, 
    Username: String,
    Password: String,
    Email: String,
    Birthday: Date
}*/
app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
    .then((user) => {
        if (user){
            return res.status(400).send(req.body.Username + 'already exists');
            } else{ 
                Users
                .create({
                    Username: req.body.Username,
                    Password: req.body.Password,
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

//Allow users to update their user info by username
/*Expect JSON in this format
{
    Username: String,
    (required)
    Password: String,
    (required)
    Email: String,
    (required)
    Birthday: Date
} */
app.put('users/:Username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {$set:
    {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
    }
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

//Allow users to add a movie to their list of favorites
app.post('users/:Username/movies/:MovieID', (req, res) => { 
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

//Allow users to remove a movie from list of favorites
app.delete('users/:Username/movies/MovieID', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username }, {
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


//Allow existing users to deregister
app.delete('users/:Username', (req, res) => {
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

//added express.static to access documentation.html
app.use(express.static('public'));

//added error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke.');
});

//added listener
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
