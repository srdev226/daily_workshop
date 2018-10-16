/** @jsx React.DOM */

jest.dontMock('../js/build/index.js')

var React        = require('react/addons')
  , TestUtils    = React.addons.TestUtils
  , CommentError = require('../js/build/index').CommentError

describe('CommentError', function() {
  it('Should display an error', function() {
    var error = TestUtils.renderIntoDocument(
      <CommentError message="I am an error message yo" />
    )

    var message = TestUtils.findRenderedDOMComponentWithClass(error, 'error-message')
    expect(message.getDOMNode().textContent).toEqual('I am an error message yo')
  })
})
