import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import AceEditor from 'react-ace';
import copy from 'copy-to-clipboard';
import { store as Notification } from 'react-notifications-component';
import { Grid, Button, Chip } from '@material-ui/core';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-plain_text';
import 'ace-builds/src-noconflict/theme-dracula';

const theme = 'dracula'
class Paste extends Component {
  constructor(props) {
    super(props)
    this.state = {
      paste: {
        date: '',
        author: '',
        text: '',
        type: '',
      },
      new: false,
      editorHeight: '85vh',
      editorWidth: 'auto'
    }
    this.getPaste()
    this.onResize = this.onResize.bind(this)
  }

  onResize = (w, h) => {
    this.setState({
      editorWidth: w,
      editorHeight: h
    })
  }

  getPaste = () => {
    const post_id = this.props.match.params.id
    const get_url = this.props.get_url.replace('%s', post_id)
    axios.get(get_url)
      .then(response => {
        const status = response.data.status

        if(status === 'success') {
          this.setState({
            ...this.state,
            paste: {
              date: response.data.date,
              author: response.data.author,
              text: response.data.text,
              type: response.data.type
            }
          })
        } else {
          this.setState({
            ...this.state,
            paste: {
              date: null,
              author: null,
              text: null,
              type: null
            }
          })
        }
      }).catch(error => {
        // If there is an error, leave everything as is.
        this.setState({
          ...this.state,
          paste: {
            date: null,
            author: null,
            text: null,
            type: null
          }
        })
      })
  }

  copyToClipboard = () => {
    const post_url = window.location.origin + '/' + this.props.match.params.id
    copy(post_url)

    Notification.addNotification({
      title: 'Link copied to clipboard!',
      message: 'You can now share your new paste with anyone!',
      type: 'success',
      insert: 'bottom',
      container: 'bottom-left',
      animationIn: ['animated', 'bounceIn'],
      animationOut: ['animated', 'zoomOut'],
      dismiss: {
        duration: 3000,
        onScreen: false
      }
    });
  }

  redirectHome = () => {
    this.setState({
      ...this.state,
      new: true
    })
  }

  render() {
    if(!this.state.new) {
      if(this.state.paste.text !== null) {
        return (
          <Grid container>
            <Grid item xs={6} style={{ paddingLeft: '0.5%', paddingTop: '0.5%' }} >
              <Chip label={this.state.paste.author} />
              <Chip label={this.state.paste.date} style={{ marginLeft: '0.5%', marginRight: '0.5%' }} />
              <Chip label={this.state.paste.type} />
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'right', paddingRight: '0.5%', paddingTop: '0.5%' }} >
              <Button 
                variant='contained' color='primary' 
                onClick={this.copyToClipboard} 
                style={{ background: '#0269a4', marginRight: '0.5%' }}>
                Copy Link
              </Button>
              <Button 
                variant='contained' color='primary' 
                onClick={this.redirectHome} 
                style={{ background: '#0269a4' }}>
                Create New Paste
              </Button>
            </Grid>
            <Grid item xs={12} style={{ margin: '0.5%' }} >
              <AceEditor
                name='paste'
                theme={theme}
                height={this.state.editorHeight}
                width={this.state.editorWidth}
                value={this.state.paste.text}
                mode={this.state.paste.type}
                showGutter={false}
                showPrintMargin={false}
                editorProps={{ $blockScrolling: true }}
                cursorStart={0}
                showLineNumbers={false}
                readOnly={true}
                highlightActiveLine={false}
                setOptions={{
                  showLineNumbers: false
                }}
              />
            </Grid>
          </Grid>
        )
      } else {
        // TODO: Have a better UI to display that a paste was not found under this ID.
        return (
          <p>There was no data found!</p>
        )
      }
    } else {
      const redirect_path = '/'
      return <Redirect to={{ pathname: redirect_path }} />
    }
  }
}

export default Paste;