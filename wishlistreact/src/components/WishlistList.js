import React, { Component } from "react";
import PropTypes from "prop-types";

class WishlistList extends Component {
  static propTypes = {
    currentId: PropTypes.number.isRequired,
    lists: PropTypes.array.isRequired,
    onListClick: PropTypes.func.isRequired
  };

  render() {
    const buttonStyle = {
      height: "20px",
      width: "50px",
      display: "inline-block",
      position: "absolute",
      right: "0",
      bottom: "0",
      marginBottom: "10px"
    };

    const inactive = {
      color: "#000"
    };

    const active = {
      backgroundColor: "#2e7da3",
      color: "#fff"
    };

    const lists = this.props.lists.map(item =>
      <li key={item.id} style={ (this.props.currentId === item.id) ? active : inactive } onClick={() => this.props.onListClick(item.id)}>{item.name}</li>
    );

    return (
      <div style={{ height: "100%" }}>
        <div style={{ position: "relative", height: "39px" }}>
          <h4 style={{ display: "inline-block"}}>Wishlists</h4>
          <button style={ buttonStyle }>New</button>
        </div>
        <div id="wishlists">
          <ul>
            {lists}
          </ul>
        </div>
      </div>
    );
  }
}

export default WishlistList;