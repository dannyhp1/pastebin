
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import AceEditor from 'react-ace';
import { Grid, Button, CircularProgress, Select, MenuItem } from '@material-ui/core';
import configuration from '../../constants/pastebin/configuration';
import { StyleSheet, css } from 'aphrodite';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-plain_text';
import 'ace-builds/src-noconflict/theme-pastel_on_dark';

const theme = 'pastel_on_dark';

function PastebinEditor(props) {
  const [height, setHeight] = useState('80vh');
  const [width, setWidth] = useState('auto');
  // eslint-disable-next-line
  const [author, setAuthor] = useState('Space Monkey');
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('plaintext');
  const [postId, setPostId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [serverHealthStatus, setServerHealthStatus] = useState('unhealthy');

  useEffect(() => {
    // Ping the server to wake it up to allow execution.
    pingServer();
  }, []);

  const pingServer = async () => {
    axios.get(configuration.PING_ENDPOINT)
      .then(response => {
        if(response['data']['status'] === 'healthy') {
          setServerHealthStatus(response['data']['status']);
        }
    });
  };

  // eslint-disable-next-line
  let onResize = (width, height) => {
    setHeight(height);
    setWidth(width);
  }

  onResize = onResize.bind(this);

  const uploadPaste = () => {
    if(text === '') {
      alert('You cannot upload an empty paste.')
      return
    }

    // TODO: Add options for author and for code highlighting.
    setIsUploading(true);
    
    axios.post(configuration.UPLOAD_PASTE_ENDPOINT, {
      author: author,
      text: text,
      language: language,
      type: 'pastebin',
    }).then(response => {
      const status = response.data.status;
      
      if(status === 'success') {
        setPostId(response.data.id);
      }
      // TODO: Notify user of error (connection made, but failed in the backend).
    }).catch(error => {
      // TODO: Notify user of error (connection was not made successfully).
    })
  }

  const renderCircularProgress = () => {
    return (
      <CircularProgress />
    )
  }

  return (
    <div>
      {postId === null 
        ?
          <Grid container>
            <Grid item xs={12}>
              <AceEditor
                name='editor'
                mode={language}
                theme={theme}
                height={height}
                width={width}
                value={text}
                onChange={setText}
                showPrintMargin={false}
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                  showLineNumbers: true,
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                }}
              />
            </Grid>
            <Grid container className={css(styles.menu)}>
              <Grid item xs={6}>
                <Select
                  className={css(styles.languageSelector)}
                  labelId='select-language-label'
                  id='select-language'
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  style={{ color: '#ffffff', marginRight: '0.75%' }}
                >
                  <MenuItem value='plaintext'>Plain Text</MenuItem>
                  <MenuItem value='python'>Python</MenuItem>
                  <MenuItem value='java'>Java</MenuItem>
                  <MenuItem value='c_cpp'>C++</MenuItem>
                  <MenuItem value='golang'>Go</MenuItem>
                  <MenuItem value='javascript'>Javascript</MenuItem>
                  <MenuItem value='sql'>SQL</MenuItem>
                  <MenuItem value='json'>JSON</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={6} style={{ textAlign: 'right' }}>
                <Button variant='contained' color='primary' 
                  onClick={() => setText('')}
                  className={css(styles.button)}
                >
                  Clear Text
                </Button>
                <Button variant='contained' color='primary'
                  onClick={uploadPaste}
                  disabled={isUploading || serverHealthStatus === 'unhealthy'}
                  className={css(styles.submitButton)}
                >
                  {serverHealthStatus === 'unhealthy' ? 'Connecting to server...' : isUploading ? renderCircularProgress() : 'Upload Paste'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        :
          <Redirect to={{ pathname: '/pastebin/' + postId }} />
      }
    </div>
  )
};

const styles = StyleSheet.create({
  menu: {
    paddingTop: '1.5%',
    height: '12vh',
    backgroundColor: '#2B2828',
    color: '#ffffff',
  },
  languageSelector: {
    marginTop: '1%',
    marginLeft: '3.5%',
    width: '125px'
  },
  button: {
    marginTop: '1%',
    marginRight: '2.5%',
    background: '#0269a4',
    maxHeight: '50px',
  },
  submitButton: {
    marginTop: '1%',
    marginRight: '2.5%',
    background: '#2D804F',
    maxHeight: '50px',
  },
});


export default PastebinEditor;