/** @jsx React.DOM */

'use strict';

if (typeof module !== 'undefined') {
  var React  = require('react/addons')
    , moment = require('moment')
}

var App = typeof App !== 'undefined' ? App : {}

App.videoId = 'x1xlz9m'

var CommentBox = React.createClass({displayName: 'CommentBox',
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
      React.DOM.div(null, 
        this.state.postError ? CommentError( {message:this.state.error} ) : '',
        CommentCount( {data:this.state.data} ),
        CommentForm( {onNewComment:this.onNewComment} ),
        CommentList( {data:this.state.data} )
      )
    )
  }
})

var CommentCount = React.createClass({displayName: 'CommentCount',
  render: function() {
    var nbrComment = this.props.data.length
    return (
      React.DOM.div(null, 
        React.DOM.h2(null, nbrComment, " ", nbrComment === 1 ? 'Comment' : 'Comments')
      )
    )
  }
})

var CommentForm = React.createClass({displayName: 'CommentForm',
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
      React.DOM.form( {onSubmit:this.handleSubmit}, 
        React.DOM.div( {className:"form-group"}, 
          React.DOM.textarea( {className:"form-control", ref:"message", placeholder:"Leave a comment!"})
        ),
        React.DOM.div( {className:"form-group"}, 
          React.DOM.button( {className:"btn btn-primary"}, "Post comment")
        )
      )
    )
  }
})

var CommentError = React.createClass({displayName: 'CommentError',
  render: function() {
    return (
      React.DOM.div( {className:"alert alert-danger"}, 
        React.DOM.p(null, "An error occured"),
        this.props.message ?
          React.DOM.p( {className:"error-message"}, this.props.message) : ''
        
      )
    )
  }
})

var CommentList = React.createClass({displayName: 'CommentList',
  render: function() {
    var comments = _.sortBy(this.props.data, 'created_time').reverse()
    comments = comments.map(function(comment) {
      return Comment( {message:comment.message, avatar:comment['owner.avatar_120_url'], date:comment.created_time, screenname:comment['owner.screenname']} )
    })
    return (
      React.DOM.div(null, 
        comments
      )
    )
  }
})

var Comment = React.createClass({displayName: 'Comment',
  render: function() {
    return (
      React.DOM.div( {className:"row media"}, 
        React.DOM.div( {className:"col-md-1"}, 
          React.DOM.img( {className:"media-object", src:this.props.avatar} )
        ),
        React.DOM.div( {className:"col-md-11 media-body"}, 
          React.DOM.h5( {className:"media-heading"}, this.props.screenname),
          React.DOM.div( {className:"comment-message"}, this.props.message),
          React.DOM.p( {className:"text-muted"}, moment(this.props.date * 1000).fromNow())
        )
      )
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
    CommentBox(null ),
    document.querySelector('#comments')
  )
}
