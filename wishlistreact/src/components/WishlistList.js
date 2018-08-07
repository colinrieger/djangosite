import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from './Dialog';
import { getCookie } from '../utils';

class WishlistList extends Component {
  constructor(props) {
    super(props);

    this.closeDialog = this.closeDialog.bind(this);
    this.openWishlistCreateDialog = this.openWishlistCreateDialog.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleCreateWishlist = this.handleCreateWishlist.bind(this);
  }

  static propTypes = {
    currentId: PropTypes.number.isRequired,
    wishlists: PropTypes.array.isRequired,
    onListClick: PropTypes.func.isRequired,
    onListChanged: PropTypes.func.isRequired
  };

  state = {
    dialogOpen: false,
    formName: ''
  };

  closeDialog() {
    this.setState({ dialogOpen: false, formName: '' });
  }

  openWishlistCreateDialog() {
    this.setState({ dialogOpen: true });
  }

  handleFormChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    this.setState({ [name]: value });
  }

  handleCreateWishlist() {
    const url = 'add/';
    fetch(url, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({
        'name': this.state.formName
      })
    })
    .then(response => { this.closeDialog(); this.props.onListChanged(); });
  }

  render() {
    /* styles */
    const buttonStyle = {
      height: 20,
      display: 'inline-block',
      position: 'absolute',
      right: 0,
      bottom: 0,
      marginBottom: 10
    };

    const inactiveStyle = {
      color: '#000'
    };

    const activeStyle = {
      backgroundColor: '#2e7da3',
      color: '#fff'
    };

    /* components */
    const wishlists = this.props.wishlists.map(wishlist =>
      <li key={wishlist.id} style={ (this.props.currentId === wishlist.id) ? activeStyle : inactiveStyle } onClick={() => this.props.onListClick(wishlist.id)}>{wishlist.name}</li>
    );

    const createWishlistDialog = (
      <Dialog
        visible={this.state.dialogOpen}
        title='Create Wishlist'
        buttons={[
          {
            'name': 'Create',
            'handler': this.handleCreateWishlist
          },
          {
            'name': 'Cancel',
            'handler': this.closeDialog
          }
        ]}
        width={400}
        height={200}>
        <label>
          Name:
          <input
            name="formName"
            type="text"
            value={this.state.formName}
            onChange={this.handleFormChange} />
        </label>
      </Dialog>
    );

    return (
      <div style={{ height: '100%' }}>
        <div style={{ position: 'relative', height: '39px' }}>
          <h4 style={{ display: 'inline-block' }}>Wishlists</h4>
          <button style={buttonStyle} onClick={this.openWishlistCreateDialog}>Create</button>
        </div>
        <div id='wishlists'>
          <ul>
            {wishlists}
          </ul>
        </div>
        {createWishlistDialog}
      </div>
    );
  }
}

export default WishlistList;