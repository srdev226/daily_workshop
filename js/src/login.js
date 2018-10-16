/** @jsx React.DOM */

'use strict';

var App = {
    session: false
  , user:    false
}

DM.init({
    apiKey: '4157b6a4c5f51a34580d'
  , status: true
  , cookie: true
})

var LoginBox = React.createClass({
  getInitialState: function() {
    return {logged: false}
  },
  componentWillMount: function() {
    var self = this
    DM.getLoginStatus(function(res) {
      if (res.status === 'connected') {
        App.session = res.session
        self.getUser()
      }
    })
  },
  login: function() {
    var self = this
    DM.login(function(res) {
      if (res.session) {
        if (res.session.scope) {
          App.session = res.session
          self.getUser()
        }
      }
    }, {scope: 'manage_comments'})
  },
  logout: function() {
    var self = this
    DM.logout(function() {
      App.session = false
      App.user    = false
      self.setState({logged: false})
    })
  },
  getUser: function(cb) {
    var self = this
    DM.api('/me', {fields: 'screenname,avatar_120_url'}, function(data) {
      App.user = data
      self.setState({username: data.screenname, logged: true})
    })
  },
  render: function() {
    return (
      <div>
        {this.state.logged ?
          <div><h4 className="pull-left">Hello {this.state.username}</h4>
          <LogoutButton onLogout={this.logout} /></div> :
          <LoginButton onLogin={this.login} />
        }
      </div>
    )
  }
})

var LoginButton = React.createClass({
  render: function() {
    return (
      <button className="pull-right btn btn-default" onClick={this.props.onLogin}>Login</button>
    )
  }
})

var LogoutButton = React.createClass({
  render: function() {
    return (
      <button className="pull-right btn btn-default" onClick={this.props.onLogout}>Log out</button>
    )
  }
})

React.renderComponent(
  <LoginBox />,
  document.querySelector('#login-button')
)
