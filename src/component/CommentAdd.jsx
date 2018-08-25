import React, { Component } from 'react'
// import {
//     Route,
// } from 'react-router-dom'

import axios from 'axios';


class CommentAdd extends Component {

  constructor(props) {
    super(props);
    // console.log('comment add', this.props);
    // console.log('comment add', this.props.commentAdd);
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
    // let req_body = {
    //   'nickname': nickname,
    //   'email': email,
    //   'content': content
    // };

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
    // if(name == 'email' && value == '') {
    //   value = null;
    // };

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
    const { submitting, error, comment } = this.state

    return (
      <form method="POST" action={ this.props.api } onSubmit={ this.onSubmit.bind(this) }>
        <fieldset disabled={ submitting? "disabled": false }>
          <legend>我有话要讲</legend>
          <input type="text" name="nickname" value={ comment.nickname } onChange={ this.onChange.bind(this) } placeholder="* 怎么称呼您呐_(:з」∠)_" required="required" />
          <input type="email" name="email" value={ comment.email } onChange={ this.onChange.bind(this) } placeholder="电子邮箱，不会被显示和公布" />
          <textarea rows="5" name="content" value={ comment.content } onChange={ this.onChange.bind(this) } placeholder="* 来都来了不说说都不好意思直接走..."></textarea>
          { error && <p>{error}</p> }
          <button type="submit">我要讲话了</button>
        </fieldset>
      </form>
    );
  }

}


export default CommentAdd;
