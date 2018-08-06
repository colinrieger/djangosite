import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Dialog extends Component {
  static defaultProps = {
    modal: true
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
    buttons: PropTypes.array.isRequired,
    visible: PropTypes.bool.isRequired,
    modal: PropTypes.bool
  };

  state = {
    details: {},
    data: []
  };

  render() {
    if (!this.props.visible) {
      return null;
    }

    const modalStyle = {
      backgroundColor: 'rgba(0,0,0,0.3)',
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      padding: 120
    };

    const dialogStyle = {
      backgroundColor: '#fff',
      borderRadius: 5,
      width: 500,
      height: 400,
      margin: '0 auto'
    };

    const titleStyle = {
      height: 30,
      widht: '100%',
      borderBottom: '1px solid gray',
      padding: '5px 10px'
    }

    const buttonBarStyle = {
      height: 31,
      width: '100%',
      backgroundColor: 'lightblue',
      padding: '5px 10px'
    };

    const childrenStyle = {
      height: 'calc(100% - ' + titleStyle.height + 'px - ' + buttonBarStyle.height + 'px)',
      padding: 10
    };

    const buttonStyle = {
      marginLeft: 5
    };

    const buttons = (
      <div style={{ float: 'right' }}>
        {this.props.buttons.map(button => <button key={button.name} onClick={button.handler} style={buttonStyle}>{button.name}</button>)}
      </div>
    );

    return (
      <div style={ this.props.modal ? modalStyle : {} }>
        <div style={dialogStyle}>
          <div style={titleStyle}>{this.props.title}</div>
          <div style={childrenStyle}>{this.props.children}</div>
          <div style={buttonBarStyle}>{buttons}</div>
        </div>
      </div>
    );
  }
}

export default Dialog;