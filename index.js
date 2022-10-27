const express = require('express');
morgan = require('morgan');

const app = express();

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
       writer: 'Paul Mayersberg' 
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
app.get('/movies', (req, res) => {
    res.json(myTopNoirMovies);
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
