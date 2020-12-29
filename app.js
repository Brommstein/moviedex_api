/* eslint-disable strict */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const movies = require('./movies.js');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

app.use(function validateToken(req, res, next){
  const API_TOKEN = process.env.API_TOKEN;
  const authToken = req.get('Authorization');
  if(!authToken || authToken.split(' ')[1] !== API_TOKEN){
    return res.status(401).json({error: 'Unauthorized request.'});
  }
  next();
});

app.get('/movie', (req, res) => {
  const { genre, country, avg_vote } = req.query;
  let movieSearch = [...movies];

  //genre
  if (genre) {
    movieSearch = movieSearch.filter(movie => { return movie.genre.toLowerCase().includes(genre.toLowerCase()); });
  }

  //country
  if (country) {
    movieSearch = movieSearch.filter(movie => { return movie.country.toLowerCase().includes(country.toLowerCase()); });
  }

  //avg_vote
  if (avg_vote) {
    movieSearch = movieSearch.filter(movie => { return movie.avg_vote >= avg_vote; });
  }

  res.json(movieSearch);
});

app.listen(8000, () => {
  console.log('Experss server is listening to port 8000.');
});