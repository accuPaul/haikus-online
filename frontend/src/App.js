import React, { Component } from 'react';
import AppNavbar from './components/AppNavbar';
import HaikuList from './components/HaikuList';
import HaikuModal from './components/haikuModal'
import { Provider } from 'react-redux';
import { Container } from 'reactstrap';
import store from './store';
import { loadUser } from './actions/authActions';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {

  componentDidMount() {
    store.dispatch(loadUser());
  };

  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <AppNavbar />
          <Container>
            <HaikuModal />
            <HaikuList />
          </Container>
        </div>
      </Provider>
    );
  };
};

export default App;
