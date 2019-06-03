import React from 'react';
import axios from 'axios';
const _ = require('lodash');

import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: {
      main: '#f44336',
    },
  },
});

// import { Typography, Paper, Avatar, CircularProgress, Button } from '@material-ui/core'
// import VerifiedUserOutlined from '@material-ui/icons/VerifiedUserOutlined'
// import withStyles from '@material-ui/core/styles/withStyles'

// import '../../App.css';
import Search from '../Components/Search.jsx';
import MovieList from '../Components/MovieList.jsx';
import MovieDescript from './MovieDescript.jsx';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      search: '',
      movie: null,
    };

    this.getNowPlayingMovies = this.getNowPlayingMovies.bind(this);
    this.getSearchedMovies = this.getSearchedMovies.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.viewWatchlist = this.viewWatchlist.bind(this);
    this.goHome = this.goHome.bind(this);
  }

  // handle request for movies playing in theatres now
  getNowPlayingMovies() {
    return axios.get('/now-playing')
      .then((movies) => {
        return _.shuffle(movies.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // handle request for searching for a movie
  getSearchedMovies(movie) {
    return axios.get(`/movie/${movie}`)
      .then((movies) => {
        return movies.data.data;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // when user visits page, show now playing movies and set them to state
  componentDidMount(e) {
    this.getNowPlayingMovies()
      .then((response) => {
        this.setState({
          movies: response,
          movie: null,
        });
      })
      .catch((error) => {
        console.error(error);
      })
  };

  // when user searches for a movie, get movies matching search and set them to state
  handleSearch(input) {
    this.setState({ search: input })
    this.getSearchedMovies(input)
      .then((movies) => {
        this.setState({movie: null});
        this.setState({movies: movies})
      })
      .catch((error) => {
        console.error(error);
      });
    event.preventDefault();
  }

  goHome() {
    this.getNowPlayingMovies()
      .then((response) => {
        this.setState({
          movies: response,
          movie: null,
        });
      })
  }

  viewWatchlist() {
    axios.post('/usersMovies', {email: this.props.user.email})
      .then((res) => {
        this.setState({
          movies: res.data,
          movie: null,
        })
      })
      .catch((err) => {
        console.error(err);
      })
  }

  // when a movie is clicked, set the state for movie to the object of the clicked movie
  handleClick(movie) {
    axios.put('/votes', {
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.posterPath,
      vote_count: movie.voteCount,
      vote_average: movie.voteAvg,
      numFlag: 0,
    })
    .then((res) => {
      this.setState({
        movie: movie,
        userVotes: res.data[0].userVotes,
      });
    })
  };

  render() {
    if (this.state.movie) { // show a movie's details when it is clicked
      return (
        <div>
          <Search handleSearch={this.handleSearch} />
          <button onClick={this.goHome}>Home</button>
          <button onClick={this.viewWatchlist}>View Watchlist</button>
          <MovieDescript userVotes={this.state.userVotes} movie={this.state.movie} user={this.props.user} />
        </div>
      );
    } 
    // else if (this.state.searchedMovies.length) { // show a movielist when page is visited and a movie is searched
    //   return (
    //     <div>
    //       <Search handleSearch={this.handleSearch} />
    //       <MovieList movies={this.state.movies} handleClick={this.handleClick} />
    //     </div>
    //   );
    // }
     else {
      return (
        <div>
          <Search handleSearch={this.handleSearch} />
          <button onClick={this.goHome}>Home</button>
          <button onClick={this.viewWatchlist}>View Watchlist</button>
          <MovieList movies={this.state.movies} handleClick={this.handleClick} />
        </div>
      );
    }
  };

}

export default Main;