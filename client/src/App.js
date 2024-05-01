import {BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import {Container } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

import {AuthProvider } from './context/auth';
import AuthRoute from './util/AuthRoute';

import MenuBar from './components/MenuBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SinglePost from "./pages/SinglePost";

const App = () => {
  return (
      <AuthProvider>
        <Router>
          <Container>
            <MenuBar />
            <Routes>
             <Route exact path='/' element={<Home />}/>
             <Route path="/login" element={<Login/>}/>
             <Route exact path='/register'element={<Register />}/>
             <Route exact path="/posts/:postId" element={<SinglePost/>}/> 
            </Routes>
          </Container>
        </Router>
      </AuthProvider>
  );
  
}

export default App;
