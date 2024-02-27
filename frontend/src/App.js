import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navigation from "./components/Navigation"
import HaikuList from './pages/HaikuList';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import RequireAuth  from './components/RequireAuth'
import PersistLogin from './components/auth/PersistLogin';
import Layout from './components/Layout';
import { Container } from 'react-bootstrap';
import './App.css';
import Users from './pages/Users';


function App() {
 return (
        <Container fluid>
              <Header />
              <Navigation />
              <Routes>
                  <Route path="/" element={<Layout />}>
                        {/* public */}
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/unauthorized' element={<Unauthorized />} />
              {/* <Route path="/" element={<HaikuList />} /> */}
              <Route element={<PersistLogin />}>
                  <Route path='/' element={<HaikuList />} />
                  <Route path="/:source/:sort" element={<HaikuList />} />

                                {/* private */}

                  <Route element={<RequireAuth adminOnly={true} />}>
                        <Route path="/users" element={<Users />} />
          </Route>
              </Route>
            
                  </Route>
              </Routes>
        </Container>
  );
}

export default App;
