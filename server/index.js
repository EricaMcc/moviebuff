//Load HTTP module
require('dotenv').config();
const path = require('path');
const hostname = process.env.SERVER_HOST;
const port = process.env.SERVER_PORT;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { // pull all backend helper functions for server and database interaction
  getMovie,
  getPopular,
  getReviews,
  nowPlaying,
  storeMovie,
  storeUser,
  grabUserVotes,
  changeVotes,
  findUserId,
  findMovieId,
  storeUsersMovies 
} = require('./helpers/index');

app.use(express.static(path.join(__dirname, "../client/dist")));
app.use(bodyParser.json());

//listen for request on port 3000, and as a callback function have the port listened on logged
app.listen(port, hostname, () => console.log(`Server running at http://${hostname}:${port}/`));

app.post('/movies', (req, res) => { 
  const { title, overview, poster_path, vote_count, vote_average, email } = req.body;
  storeMovie( // store movie data in database relative to schema
    title,
    overview,
    poster_path,
    vote_count,
    vote_average
  )
  .then(() => findMovieId(title))
  .then(movDbId => findUserId(email).then(uDbId => storeUsersMovies(movDbId, uDbId))) // stores user's movies into the join table
  .then(() => res.send(201)) // respond with a good status
  .catch(error => {
    console.error(error);
    res.sendStatus(500);
  })
});

app.post('/users', (req, res) => { 
  const { displayName, email } = req.body.user; // pull username and email from body sent from frontend
  storeUser(displayName, email) // store user info into database
    .then(() => res.send(201)) // respond with a good status
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    })
})

app.put('/votes', (req, res) => { // should be called when up or downvote is clicked
  const { title, overview, poster_path, vote_count, vote_average, numFlag } = req.body; // pull title and numFlag from req.body passed in through frontend -- numFlag expected to be 1 or -1
  storeMovie( // store movie data in database relative to schema
    title,
    overview,
    poster_path,
    vote_count,
    vote_average
  )
  .then(() => findMovieId(title)) // find the id from the title stored in the database
  .then(movDbId => changeVotes(movDbId, numFlag)) // change userVotes in the database
  .then(movDbId => grabUserVotes(movDbId)) // grabs userVotes from the database
  .then(userVotes => res.json(userVotes)) // sends userVotes back to the client
  .catch(error => {
    console.error(error);
    res.sendStatus(500);
  })
})

app.get

app.get('/now-playing', (req, res) => {
  nowPlaying()
    .then(movies => {
      const { results } = movies.data; // pull results from movies.data
      const currentMovies = results.map(movie => { // return an array of objects for each movie
        return {
          movieId: movie.id,
          title: movie.title,
          overview: movie.overview,
          posterPath: movie.poster_path,
          voteAvg: movie.vote_average,
          voteCount: movie.vote_count,
        }
      });
      res.json({ data: currentMovies }); // respond with object movie data
    })
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    })
});

app.get('/movie/:movieName', (req, res) => { // route that points to a movie name search
  const { movieName } = req.params; // pull movieName from body sent from front end
  getMovie(movieName)
    .then(searchResults => {
      const searchedMovies = searchResults.map(movie => {
        return {
          movieId: movie.id,
          title: movie.title,
          overview: movie.overview,
          posterPath: movie.poster_path,
          voteAvg: movie.vote_average,
          voteCount: movie.vote_count,
        }
      });

      res.json({ data: searchedMovies });
    })
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    })
});

app.post('/reviews', (req, res) => { // Testing needed -- edge case and destructuring
  const { movieId } = req.body; // pull movieId from body sent from front end
  getReviews(movieId)
    .then(reviews => {
      // test edgecase of no reviews in front end
      const shortReviews = reviews.map(review => { // format reviews into array of objects containing shortened reviews
        return { 
          author: review.author,
          content: review.content.substring(0, 500) + '...',
          url: review.url,
        }
      });
      res.send({reviews: shortReviews}); // respond with reviews array stored on an object
    })
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    });
});

app.get('/popular', (req, res) => { 
  getPopular()
    .then(popularMovies => res.send(popularMovies)); // send back popular movies
})

//route for user account page
app.get('/account', (req, res) => {
  res.render('account')
})

//route for login page
app.get('/login', (req, res) => {
  res.render('login')
})

//route for search results page
app.get('/results', (req, res) => {
  res.render('results')
})
