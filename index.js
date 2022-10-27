const express = require('express');
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
]