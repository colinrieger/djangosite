import React, { Component } from 'react';
import PropTypes from 'prop-types';

class WishlistList extends Component {
  static propTypes = {
    currentId: PropTypes.number.isRequired,
    wishlists: PropTypes.array.isRequired,
    onWishlistClick: PropTypes.func.isRequired,
    onDeleteWishlist: PropTypes.func.isRequired
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
    const wishlists = this.props.wishlists.map(wishlist =>
      <li key={wishlist.id} style={ (this.props.currentId === wishlist.id) ? activeStyle : inactiveStyle } onClick={() => this.props.onWishlistClick(wishlist.id)}>
        {wishlist.name}
        <button style={buttonStyle} onClick={(e) => this.props.onDeleteWishlist(wishlist.id, e)}>X</button>
      </li>
    );

    return (
      <div id='wishlists'>
        <ul>
          {wishlists}
        </ul>
      </div>
    );
  }
}

export default WishlistList;