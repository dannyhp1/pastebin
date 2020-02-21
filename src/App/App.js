import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ReactNotification from 'react-notifications-component';
import Header from '../components/Header';
import Paste from '../components/Paste';
import Editor from '../components/Editor';
import 'react-notifications-component/dist/theme.css'
import './App.css';

// Backend endpoint to save data.
const DEV_POST_URL = 'http://localhost:5000/pastebin/save'
const PROD_POST_URL = 'https://aws.dannyhp.com/pastebin/save'
const POST_URL = PROD_POST_URL

// Backend endpoint to load data.
const DEV_GET_URL = 'http://localhost:5000/pastebin/load/%s'
const PROD_GET_URL= 'https://aws.dannyhp.com/pastebin/load/%s'
const GET_URL = PROD_GET_URL

class App extends Component {
  render() {
    return (
      <div>
        <ReactNotification />
        <div className='App'>
          <Header />
          <Router>
            <div>
              <Route 
                exact
                path='/' 
                render={(props) => <Editor {...props} post_url={POST_URL} get_url={GET_URL} />}
              />
            </div>
            <div>
              <Route 
                exact
                path='/:id' 
                render={(props) => <Paste {...props} get_url={GET_URL} />}
              />
            </div>
          </Router>
        </div>
      </div>
    )
  }
}

export default App;