import React from 'react';
import routes from '../routes/routes';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ReactNotification from 'react-notifications-component';
import NavigationBar from '../components/navigation/NavigationBar';
import PastebinEditor from '../components/pastebin/PastebinEditor';
import PastebinPaste from '../components/pastebin/PastebinPaste';
import 'react-notifications-component/dist/theme.css'
import './App.css';

function App() {
  return (
    <div className="App">
      <ReactNotification />
      <Router>
        <NavigationBar />
        <Route
          exact
          path={routes['default']}
          render={(props) => <PastebinPaste {...props} />}
        />
        <Route 
          exact
          path={routes['pastebin']} 
          render={(props) => <PastebinEditor {...props} />}
        />
        <Route
          exact
          path={routes['pastebinId']}
          render={(props) => <PastebinPaste {...props} />}
        />
        <Route
          exact
          path={routes['sourceCode']}
          component={() => {
            window.location.href = 'https://github.com/dannyhp1/pastebin'
          }}
        />
      </Router>
    </div>
  );
}

export default App;
