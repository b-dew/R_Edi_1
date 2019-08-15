import React, { Component } from 'react';
import PropTypes from 'prop-types';
var ReactDOM = require('react-dom');

class Parent extends React.Component {
    constructor () {
      super()
      this.state = {
        isHidden: true
      }
    }
    toggleHidden () {
      this.setState({
        isHidden: !this.state.isHidden
      })
    }
    render () {
      return (
        <div>
          <button onClick={this.toggleHidden.bind(this)} >
            Click to show modal
          </button>
          {!this.state.isHidden && <Child />}
        </div>
      )
    }
  }
  
  const Child = () => (
  <div className='modal'>
        Hello, World!
    </div>
  )
  
//   const app = document.getElementById('app')
//   ReactDOM.render(Parent, app)