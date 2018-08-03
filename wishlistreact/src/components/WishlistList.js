import React, { Component } from "react";
import PropTypes from "prop-types";

class WishlistList extends Component {
  static propTypes = {
    lists: PropTypes.array.isRequired,
    handleClick: PropTypes.func.isRequired
  };

  render() {
    const lists = this.props.lists.map(item =>
      <li key={item.id} onClick={() => this.props.handleClick(item.id)}>{item.name}</li>
    );

    return (
      <div>
        <ul>
          {lists}
        </ul>
      </div>
    );
  }
}

export default WishlistList;