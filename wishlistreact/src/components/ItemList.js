import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ItemList extends Component {
  static propTypes = {
    className: PropTypes.string,
    selectedIndex: PropTypes.number.isRequired,
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
    let items = "";
    if (this.props.items != null)
      items = this.props.items.map((item, index) =>
          <li key={item.id} style={(this.props.selectedIndex === index) ? activeStyle : inactiveStyle} onClick={() => this.props.onItemClick(index)}>
              {item.name}
              {this.props.onDeleteItem ? <button style={buttonStyle} onClick={(e) => this.props.onDeleteItem(index, e)}>X</button> : ""}
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