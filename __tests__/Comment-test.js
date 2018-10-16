/** @jsx React.DOM */

jest.dontMock('../js/build/index.js')
    .dontMock('moment')

var React     = require('react/addons')
  , TestUtils = React.addons.TestUtils
  , Comment   = require('../js/build/index').Comment

describe('Comment', function() {
  it('Should return a comment', function() {
    var comment = TestUtils.renderIntoDocument(
      <Comment message="Interesting comment about life" avatar="http://s1.dmcdn.net/AVM/120x120-bnf.png" date={+new Date / 1000} screenname="Romain Berger" />
    )

    // Comment message
    var message = TestUtils.findRenderedDOMComponentWithClass(comment, 'comment-message')
    expect(message.getDOMNode().textContent).toEqual('Interesting comment about life')

    // Username
    var username = TestUtils.findRenderedDOMComponentWithClass(comment, 'media-heading')
    expect(username.getDOMNode().textContent).toEqual('Romain Berger')

    // Date
    var time = TestUtils.findRenderedDOMComponentWithClass(comment, 'text-muted')
    expect(time.getDOMNode().textContent).toEqual('a few seconds ago')
  })
})
