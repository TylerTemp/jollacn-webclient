import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import TextsmsOutlinedIcon from '@material-ui/icons/TextsmsOutlined';
import Button from '@material-ui/core/Button';
import red from '@material-ui/core/colors/red';

import axios from 'axios';


const styles = theme => ({
  requiredColor: {
    'color': red[800],
  },
  flipIcon: {
    '-moz-transform': 'scaleX(-1)',
    '-webkit-transform': 'scaleX(-1)',
    '-o-transform': 'scaleX(-1)',
    'transform': 'scaleX(-1)',
    /*IE*/
    'filter': 'FlipH',
  },
  formControlFullWidth: {
    'width': '100%',
  },
  formBorder: {
    'box-shadow': 'inset 0 0 10px #a3a0a0db',
    'border': 'none',
    'padding-top': '24px',
  },
  formLegend: {
    'padding-top': '38px',
  }
});


class CommentAdd extends Component {

  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      error: null,
      comment: {
        'nickname': '',
        'email': '',
        'content': ''
      }
    }
  }

  addComment(req_body) {

    this.setState({submitting: true, error: null, comment: req_body});
    if(req_body['email'] == '') {
      req_body['email'] = null;
    };

    axios.post(
        this.props.api,
        JSON.stringify(req_body),
        {
          headers: {
            'Content-Type': 'application/json',
            'Accpected': 'application/json'
          },
          transformResponse: undefined
        }
      )
      .then(res => {
        let data = res.data;
        console.log(`comment add for ${this.props.api} result:`, data);
        let comment_result = JSON.parse(data);
        if(comment_result.email == null) {
          comment_result.email = '';
        }

        this.props.commentAdd(comment_result);

        this.setState({
          submitting: false,
          error: null,
          comment: {
            'nickname': '',
            'email': '',
            'content': ''
          }
        });
      })
      .catch(res => {
        var error = 'unknown server error';
        if (res.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          var data = res.response.data;
          console.log('response', data);
          var json_resp = null;
          try {
            json_resp = JSON.parse(data);
          } catch (e) {
            error = 'server error and unable to parse error response';
          };
          if(json_resp) {
            error = json_resp.message || 'unknown server error';
          };
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', res);
          error = res.message;
        };
        console.log('set error to', error);
        this.setState({
          submitting: false,
          error: error
        });
      })
      .then(() => {
        this.setState({submitting: false});
      });
  }

  onChange(evt) {
    let target = evt.target;
    let name = target.name;
    let value = target.value;

    let comment = this.state.comment;
    comment[name] = value;
    this.setState({comment: comment});
  }

  onSubmit(evt) {
    evt.preventDefault();
    // let $form = evt.target;
    // let values = new FormData($form);
    // let values = {};
    // $form.serializeArray().map(function(_index, field)
    // {
    //   values[field.name] = field.value;
    // });

    const values = this.state.comment;

    console.log('trying submit comment', values);
    this.addComment(values);
  }

  render() {
    const { submitting, error, comment } = this.state;

    const { classes } = this.props;

    return (
      <form method="POST" action={ this.props.api } onSubmit={ this.onSubmit.bind(this) }>
        <fieldset disabled={ submitting? "disabled": false } className={ classes.formBorder }>
          <legend className={ classes.formLegend }>我有话要讲</legend>
          <Grid container spacing={24}>
            <Grid item sm={12} md={6}>
              <FormControl className={ classes.formControlFullWidth }>
                <InputLabel htmlFor="comment-name">
                  <span className={ classes.requiredColor }>*</span> 昵称
                </InputLabel>
                <Input
                  id="comment-name"
                  startAdornment={
                    <InputAdornment position="start">
                      <AccountCircleOutlinedIcon />
                    </InputAdornment>
                  }
                  type="text" name="nickname" value={ comment.nickname } onChange={ this.onChange.bind(this) } placeholder="* 怎么称呼您呐_(:з」∠)_" required={ true }
                />
              </FormControl>
            </Grid>
            <Grid item sm={12} md={6}>
              <FormControl className={ classes.formControlFullWidth }>
                <InputLabel htmlFor="comment-email">邮箱</InputLabel>
                <Input
                  id="comment-email"
                  startAdornment={
                    <InputAdornment position="start">
                      <EmailOutlinedIcon />
                    </InputAdornment>
                  }
                  type="email" name="email" value={ comment.email } onChange={ this.onChange.bind(this) } placeholder="不会被显示和公布"
                />
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={24}>
            <Grid item sm={12}>
              <FormControl className={ classes.formControlFullWidth }>
                <Input
                  id="comment-content"
                  multiline={ true }
                  rows={ 2 }
                  startAdornment={
                    <InputAdornment position="start">
                      <TextsmsOutlinedIcon className={ classes.flipIcon } />
                    </InputAdornment>
                  }
                  type="text"
                  name="content"
                  value={ comment.content }
                  onChange={ this.onChange.bind(this) }
                  placeholder="* 来都来了不说说都不好意思直接走..."
                  required={ true }
                />
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={24}>
            <Grid item sm={12}>
              { error && <p>{error}</p> }
            </Grid>
          </Grid>

          <Grid container spacing={24}>
            <Grid item sm={12} style={
                {'textAlign': 'right'}
              }>
              <Button type="submit" variant="contained" color="primary">我要讲话了</Button>
            </Grid>
          </Grid>

        </fieldset>
      </form>
    );
  }

}


// export default CommentAdd;
export default withStyles(styles)(CommentAdd);
