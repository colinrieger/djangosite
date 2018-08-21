import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ItemList extends Component {
  static propTypes = {
    className: PropTypes.string,
    currentId: PropTypes.number.isRequired,
    items: PropTypes.array.isRequired,
    onItemClick: PropTypes.func.isRequired,
    onDeleteItem: PropTypes.func
  };

  render() {
    /* styles */
    const buttonStyle = {
      height: 20,
      width: 20,
      float: 'right',
      padding: 0
    }

    const inactiveStyle = {
      color: '#000'
    };

    const activeStyle = {
      backgroundColor: '#2e7da3',
      color: '#fff'
    };

    /* components */
    const items = this.props.items.map(item =>
      <li key={item.id} style={ (this.props.currentId === item.id) ? activeStyle : inactiveStyle } onClick={() => this.props.onItemClick(item.id)}>
        {item.name}
        { this.props.onDeleteItem ? <button style={buttonStyle} onClick={(e) => this.props.onDeleteItem(item.id, e)}>X</button> : "" }
      </li>
    );

    return (
      <div className={this.props.className}>
        <ul>
          {items}
        </ul>
      </div>
    );
  }
}

export default ItemList;