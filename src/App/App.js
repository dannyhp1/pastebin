import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from 'axios';
import Header from '../components/Header';
import Paste from '../components/Paste';
import './App.css';

// Backend endpoint to save data.
const DEV_POST_URL = 'http://localhost:5000/pastebin_save'
const PROD_POST_URL = 'https://dev.dannyhp.com:8443/pastebin_save'
const POST_URL = PROD_POST_URL

// Backend endpoint to load data.
const DEV_GET_URL = 'http://localhost:5000/pastebin_load/%s'
const PROD_GET_URL= 'https://dev.dannyhp.com:8443/pastebin_load/%s'
const GET_URL = PROD_GET_URL

class App extends Component {
  render() {
    return (
      <div className='App'>
        <Header />

        <Router>
          <div>
            <Route 
              exact
              path='/:id' 
              render={(props) => <Paste {...props} get_url={GET_URL} />}
            />
          </div>
        </Router>
      </div>
    )
  }
}

export default App;