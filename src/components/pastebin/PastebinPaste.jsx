import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import AceEditor from 'react-ace';
import copy from 'copy-to-clipboard';
import { store as Notification } from 'react-notifications-component';
import { Grid, Button, Chip } from '@material-ui/core';
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

function PastebinPaste(props) {
  const [height, setHeight] = useState('80vh');
  const [width, setWidth] = useState('auto');
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('');
  // eslint-disable-next-line
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [isCode, setIsCode] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);

  // eslint-disable-next-line
  let onResize = (width, height) => {
    setHeight(height);
    setWidth(width);
  }

  onResize = onResize.bind(this);

  useEffect(() => {
    // Ping the server to wake it up to allow execution.
    getPaste();
    // eslint-disable-next-line
  }, []);

  const getPaste = () => {
    const pasteId = props.match.params.id;
    const getUrl = configuration.GET_PASTE_ENDPOINT.replace('%s', pasteId);

    axios.get(getUrl)
      .then(response => {
        const status = response.data.status
        if (status === 'error') {
          // If no paste is associated with this id.
          addNotification('No paste found!', 'Create a new paste!', 'danger');
          props.history.push('/pastebin');
          return;
        }

        setAuthor(response.data.author);
        setText(response.data.text);
        setLanguage(response.data.language);
        setType(response.data.type);
        setDate(response.data.date);
        
        // If the code type is 'python', provide a button to execute through coderpad.
        if (response.data.language === 'python') {
          setIsCode(true);
          addNotification('Paste successfully loaded!', '👀 You can execute this through the coderpad!', 'success');
        } else {
          addNotification('Paste successfully loaded!', '👀', 'success');
        }
      });
  };

  const copyToClipboard = () => {
    const post_url = window.location.origin + '/pastebin/' + props.match.params.id
    copy(post_url)
    addNotification('Link copied to clipboard!', 'Share it with your friends!', 'success');
  };

  const redirectToCoderpad = () => {
    props.history.push('/coderpad/' + props.match.params.id);
  };

  const redirectUserToHome = () => {
    setRedirectToHome(true);
  };

  const addNotification = (title, message, type) => {
    Notification.addNotification({
      title: title,
      message: message,
      type: type,
      insert: 'top',
      container: 'top-right',
      animationIn: ['animated', 'bounceIn'],
      animationOut: ['animated', 'zoomOut'],
      dismiss: {
        duration: 3000,
        onScreen: false
      }
    });
  }

  return (
    <div>
      {redirectToHome 
        ?
          <Redirect to={{ pathname: '/pastebin' }} />
        :
        <Grid container>
          <Grid item xs={12} >
            <AceEditor
              name='paste'
              theme={theme}
              height={height}
              width={width}
              value={text}
              mode={language}
              showGutter={false}
              showPrintMargin={false}
              cursorStart={0}
              readOnly={true}
              highlightActiveLine={false}
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                showLineNumbers: true,
              }}
            />
          </Grid>
          <Grid item xs={6} className={css(styles.metadata)} >
            {author !== '' &&
              <Chip label={author} className={css(styles.metadataChip)} />
            }
            {date !== '' &&
              <Chip label={date} className={css(styles.metadataChip)} />
            }
            {language !== '' &&
              <Chip label={language} className={css(styles.metadataChip)} />
            }
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right', marginTop: '1%' }} >
            <Button 
              variant='contained' color='primary' 
              onClick={copyToClipboard} 
              className={css(styles.button)}>
              Copy Link
            </Button>
            {isCode &&
              <Button 
                variant='contained' color='primary' 
                onClick={redirectToCoderpad} 
                className={css(styles.newCoderpadButton)}>
                Run on Coderpad
              </Button>
            }
            <Button 
              variant='contained' color='primary' 
              onClick={redirectUserToHome}
              className={css(styles.newPasteButton)}>
              Create New Paste
            </Button>
          </Grid>
        </Grid>
      }
    </div>
  )
};

const styles = StyleSheet.create({
  metadata: {
    marginTop: '1%',
  },
  metadataChip: {
    marginLeft: '1%',
    marginRight: '1%',
  },
  buttonWrapper: {
    marginTop: '2.5%',
  },
  button: {
    marginTop: '1%',
    marginRight: '2.5%',
    background: '#0269a4',
    maxHeight: '50px',
  },
  newCoderpadButton: {
    marginTop: '1%',
    marginRight: '2.5%',
    background: '#ffc107',
    maxHeight: '50px',
  },
  newPasteButton: {
    marginTop: '1%',
    marginRight: '2.5%',
    background: '#2D804F',
    maxHeight: '50px',
  },
});

export default PastebinPaste;