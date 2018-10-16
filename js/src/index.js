/** @jsx React.DOM */

'use strict';

if (typeof module !== 'undefined') {
  var React  = require('react/addons')
    , moment = require('moment')
}

var App = typeof App !== 'undefined' ? App : {}

App.videoId = 'x1xlz9m'

var CommentBox = React.createClass({
  getInitialState: function() {
    return {data: []}
  },
  componentWillMount: function() {
    var self = this
    self.getCommentsFromAPI(function(data) {
      self.setState({data: data.list})
    })
  },
  getCommentsFromAPI: function(cb) {
    $.get('https://api.dailymotion.com/video/' + App.videoId + '/comments?fields=message,created_time,owner.avatar_120_url%2Cowner.screenname&page=1&limit=100', function(data) {
      cb(data)
    })
  },
  onNewComment: function(comment) {
    var comments = this.state.data
      , newComments = comments.concat([comment])

    this.setState({data: newComments})

    var self = this

    DM.api('/video/' + App.videoId + '/comments', 'post', {message: comment.message}, function(res) {
      // remove comment if there was an error
      // and display an error
      if (typeof res.error !== 'undefined') {
        self.setState({postError: true, error: res.error.message})
        setTimeout(function() {
          self.setState({postError: false})
        }, 3000)
        self.getCommentsFromAPI(function(data) {
          self.setState({data: data.list})
        })
      }
    })
  },
  render: function() {
    return (
      <div>
        {this.state.postError ? <CommentError message={this.state.error} /> : ''}
        <CommentCount data={this.state.data} />
        <CommentForm onNewComment={this.onNewComment} />
        <CommentList data={this.state.data} />
      </div>
    )
  }
})

var CommentCount = React.createClass({
  render: function() {
    var nbrComment = this.props.data.length
    return (
      <div>
        <h2>{nbrComment} {nbrComment === 1 ? 'Comment' : 'Comments'}</h2>
      </div>
    )
  }
})

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault()

    var message = this.refs.message.getDOMNode().value
    this.props.onNewComment({
      message: message,
      date: +new Date,
      'owner.avatar_120_url': App.user.avatar_120_url,
      'owner.screenname': App.user.screenname
    })
    this.refs.message.getDOMNode().value = ''
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <textarea className="form-control" ref="message" placeholder="Leave a comment!"></textarea>
        </div>
        <div className="form-group">
          <button className="btn btn-primary">Post comment</button>
        </div>
      </form>
    )
  }
})

var CommentError = React.createClass({
  render: function() {
    return (
      <div className="alert alert-danger">
        <p>An error occured</p>
        {this.props.message ?
          <p className="error-message">{this.props.message}</p> : ''
        }
      </div>
    )
  }
})

var CommentList = React.createClass({
  render: function() {
    var comments = _.sortBy(this.props.data, 'created_time').reverse()
    comments = comments.map(function(comment) {
      return <Comment message={comment.message} avatar={comment['owner.avatar_120_url']} date={comment.created_time} screenname={comment['owner.screenname']} />
    })
    return (
      <div>
        {comments}
      </div>
    )
  }
})

var Comment = React.createClass({
  render: function() {
    return (
      <div className="row media">
        <div className="col-md-1">
          <img className="media-object" src={this.props.avatar} />
        </div>
        <div className="col-md-11 media-body">
          <h5 className="media-heading">{this.props.screenname}</h5>
          <div className="comment-message">{this.props.message}</div>
          <p className="text-muted">{moment(this.props.date * 1000).fromNow()}</p>
        </div>
      </div>
    )
  }
})

if (typeof module !== 'undefined') {
  module.exports = {
      CommentError: CommentError
    , Comment:      Comment
  }
}
else {
  React.renderComponent(
    <CommentBox />,
    document.querySelector('#comments')
  )
}
