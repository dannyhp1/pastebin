import React, { Component } from 'react'
import axios from 'axios';
import AceEditor from 'react-ace';
import { Grid, Button } from '@material-ui/core';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-plain_text';
import 'ace-builds/src-noconflict/theme-chaos';

class Paste extends Component {
  constructor(props) {
    super(props)
    this.state = {
      paste: {
        date: null,
        author: null,
        text: null,
        type: null
      },
      editorHeight: '90vh',
      editorWidth: 'auto'
    }
    this.getPaste()
    this.onResize = this.onResize.bind(this)
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
        }
      }).catch(error => {
        // If there is an error, leave everything as is.
      })
  }

  onResize = (w, h) => {
    this.setState({
      editorWidth: w,
      editorHeight: h
    })
  }

  render() {

    if(this.state.paste.text !== null) {
      return (
        <Grid container>
          <Grid item xs={4}>
            Author: {this.state.paste.author}
          </Grid>
          <Grid item xs={4}>
            Date posted: {this.state.paste.date}
          </Grid>
          <Grid item xs={12}>
            <AceEditor
              name='paste'
              theme='chaos'
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
  }
}

export default Paste;