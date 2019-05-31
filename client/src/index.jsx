import React from 'react';
import ReactDOM from 'react-dom';

import { Route, Switch } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

// import '../App.css';

import Main from './Pages/Main.jsx';
import MovieDescript from './Pages/MovieDescript.jsx';
import UserAccount from './Pages/UserAccount.jsx';
import SearchResults from './Pages/SearchResults.jsx';

//firebase imports





class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      users: [],
    };

  }


  render() {
    
    const App = () => (
      <div>
        <Switch>
          <Route exact path='/' component={Main} />
          <Route path='/movie' component={MovieDescript} />
          <Route path='/account' component={UserAccount} />
          <Route path='/results' component={SearchResults} />
        </Switch>
      </div>
    )
    return (
      <Switch>
        <App />
      </Switch>
    );
    // return (
    //   <div className="App">
    //     <header className="App-header">
    //       {/* conditionally render part of application user is interacting with */}
    //       <Main />
    //     </header>
    //   </div>
    // );
  }
}



ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>), document.getElementById('app'));