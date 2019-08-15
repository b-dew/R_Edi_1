import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Modal from './Modal';
import Button from 'react-bootstrap/lib/Button';
import * as utils from './redeye/RedEyeCorrect.js';
import { CSSTransitionGroup } from 'react-transition-group'
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
// import RedEye from './redeye';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }
  toggleModal = () => {
    const modal = this.refs.modal
    utils.toggleModal(modal);
    setTimeout(() => {
      this.setState({
        isOpen: !this.state.isOpen
    })
  }, 900);
  }

  render() {
    return (

      <div className="App">
        <button onClick={this.toggleModal}>
          Edit Photo
        </button>
        <Modal ref="modal" class="hidden" show={this.state.isOpen}
          onClose={this.toggleModal}>
        </Modal>
      </div>
    );
  }
}

export default App;