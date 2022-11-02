const express = require('express');
morgan = require('morgan');
bodyParser = require('body-parser');
uuid = require('uuid');

const app = express();

app.use(bodyParser.json());

let myTopNoirMovies = [
    {
        title: 'The Big Sleep',
        director: 'Howard Hawks',
        writers: 'William Faulkner, ' + 'Leigh Brackett, ' + 'Jules Furthman'
    },
    {
        title: 'The Third Man',
        director: 'Carol Reed',
        writer: 'Graham Greene',
    },
    {
        title: 'Touch of Evil',
        director:'Orson Welles',
        writers: 'Orson Welles,' + 'Whit Masterson',
    },
    {
        title: 'Drive',
        director: 'Nicholas Winding Refn',
        writers: 'Hossein Amini, ' + 'James Sallis',
    },
    {
        title: 'Le Samourai',
        director: 'Jean-Pierre Melville',
        writers: 'Jean-Pierre Melville, ' + 'Georges Pellegrin',
    },
    {
        title: 'Le Cercle Rouge',
        director: 'Jean-Pierre Melville',
        writer: 'Jean-Pierre Melville'
    },
    {
        title: 'No Country For Old Men',
        directors: 'Joel Cohen, ' + 'Ethan Cohen',
        writers: 'Joel Cohen, ' + 'Ethan Cohen, ' + 'Cormac McCarthy',
    },
    {
        title: 'In A Lonely Place',
        director: ' Nicholas Ray',
        writers: 'Andrew Solt, ' + 'Edmund H. North, ' + 'Dorothy B. Hughes',
    },
    {
       title: 'Croupier',
       director: 'Mike Hodges',
       writer: 'Paul Mayersberg', 
    },
    {
        title: 'Se7en',
        director: 'David Fincher',
        writer: 'Andrew Kevin Walker',
    },
];
//added morgan for logging requests
app.use(morgan('common'));

//Get Requests that return a text response
app.get('/', (req, res) => {
    res.send('Welcome to my unusual and lesser known film noir favorites. Enjoy.');
});

//Get requests that return a JSON of movie data
//app.get('/movies', (req, res) => {
    //res.send(myTopNoirMovies);
//});

//REST Requests/Responses
app.get('/movies', (req, res) => {
    res.send('Successful GET request returning data on all movies')
});
app.get('/movie/:MovieName', (req, res) => {
    res.send('Successful GET request returns data on a single movie by title to user')
});
app.get('/movies/genre/:GenreName', (req, res) => {
    res.send('Successful GET request returns data on a specific genre by name')
});
app.get('/movies/:Director', (req, res) => {
    res.send('Successful GET request returns data on a director by name')
});
app.post('/users', (req, res) => {
    let newUser = req.body;
    if (!newUser.name) {
        const message = 'Missing "name" in request body';
        res.status(400).send(message);
    } else {
    newUser.id = uuid.v4();
       users.push(newUser);
       res.status(201).send(message)
        }
    });
app.put('/users/:UserName', (req, res) => {
    res.send('Successful PUT request allows users to update their user info')
});
app.post('/users/:UserName/movie/:MovieName', (req, res) => {
    res.send('Successful POST request returns data on user and movie added to list')
});
app.delete('/users/:Username/movies/:MovieName', (req, res) => {
    res.send('Successful DELETE request returns a text alerting user movie has been removed from list')
});
app.delete('/users/:UserName/:ID', (req, res) => {
    res.send('Successful DELETE request sends text alerting user their account has been deleted')
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
