import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import AceEditor from 'react-ace';
import { Grid, Button } from '@material-ui/core';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-plain_text';
import 'ace-builds/src-noconflict/theme-monokai';

class Editor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      author: 'anonymous',
      text: ``,
      type: 'plaintext',
      post_id: null,
      disabled: false,
      editorHeight: '85vh',
      editorWidth: 'auto'
    }
    this.onResize = this.onResize.bind(this)
  }

  onResize = (w, h) => {
    this.setState({
      editorWidth: w,
      editorHeight: h
    })
  }

  onChange = (value) => {
    this.setState({
      ...this.state,
      text: value
    })
  }

  setInProgress = () => {
    this.setState({
      ...this.state,
      disabled: true
    })
  }

  setCompleted = () => {
    this.setState({
      ...this.state,
      disabled: false
    })
  }

  uploadPaste = () => {
    // TODO: Add options for author and for code highlighting.
    this.setInProgress()
    
    axios.post(this.props.post_url, {
      author: this.state.author,
      text: this.state.text,
      type: this.state.type
    }).then(response => {
      console.log(response)
      const status = response.data.status
      
      if(status === 'success') {
        const post_id = response.data.id
        this.setState({
          ...this.state,
          post_id: post_id
        })
      }

      // TODO: Notify user of error (connection made, but failed in the backend).
    }).catch(error => {
      // TODO: Notify user of error (connection was not made successfully).
    })
  }

  render() {
    if(this.state.post_id === null) {
      return (
        <Grid container>
            <Grid item xs={12}>
              <AceEditor
                name='editor'
                mode={this.props.language}
                theme='monokai'
                height={this.state.editorHeight}
                width={this.state.editorWidth}
                value={this.state.text}
                onChange={this.onChange}
                showPrintMargin={false}
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                  showLineNumbers: true,
                  enableBasicAutocompletion: this.props.autocomplete,
                  enableLiveAutocompletion: this.props.autocomplete
                }}
              />
            </Grid>
            
            <Grid item xs={12} style={{ textAlign: 'right', marginTop: '0.75%' }}>
              <Button variant='contained' color='primary' 
                onClick={this.uploadPaste} 
                disabled={this.state.disabled} 
                style={{ background: '#0269a4', marginRight: '0.75%' }}>
                {this.state.disabled ? 'Uploading paste...' : 'Upload Paste'}
              </Button>
            </Grid>
          </Grid>
      )
    } else {
      const redirect_path = '/' + this.state.post_id
      return <Redirect to={{ pathname: redirect_path }} />
    }
  }
}

export default Editor;