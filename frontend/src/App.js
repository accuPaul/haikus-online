import React, { Component } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import HaikuList from './components/HaikuList';
import { Provider } from 'react-redux';
import { Container, InputGroup } from 'reactstrap';
import store from './store';
import { loadUser } from './actions/authActions';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import HomeScreen from './components/HomeScreen';
import ListScreen from './components/ListScreen';

class App extends Component {

  componentDidMount() {
    store.dispatch(loadUser());
  };

  render() {
    return (
      <BrowserRouter>
        <Container fluid>
          <Provider store={store}>
            <div className="App">
              <AppNavbar />
              <Switch>
                <Route exact path="/" component={HomeScreen} />
                <Route path="/list" component={ListScreen} />
              </Switch>
            </div>
          </Provider>

        </Container>
      </BrowserRouter>

    );
  };
};

export default App;
