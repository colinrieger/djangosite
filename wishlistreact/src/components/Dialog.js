import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Dialog extends Component {
  static defaultProps = {
    title: '',
    buttons: [],
    width: 500,
    height: 400
  }

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    title: PropTypes.string,
    buttons: PropTypes.array,
    width: PropTypes.number,
    height: PropTypes.number
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
      right: 0
    };

    const dialogStyle = {
      position: 'absolute',
      backgroundColor: '#fff',
      borderRadius: 5,
      width: this.props.width,
      height: this.props.height,
      top: '50%',
      left: '50%',
      margin: '-' + (this.props.height / 2) + 'px 0 0 -' + (this.props.width / 2) + 'px'
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
        <div style={modalStyle}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div style={dialogStyle}>
              <div style={titleStyle}>{this.props.title}</div>
              <div style={childrenStyle}>{this.props.children}</div>
              <div style={buttonBarStyle}>{buttons}</div>
            </div>
          </div>
        </div>
    );
  }
}

export default Dialog;