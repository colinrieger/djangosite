import React, { Component } from 'react';
import ItemList from './ItemList';
import WishlistDetail from './WishlistDetail';
import Dialog from './Dialog';
import { getCookie } from '../utils';

class Wishlist extends Component {
  constructor(props) {
    super(props);
    
    this.handleLoadWishlists = this.handleLoadWishlists.bind(this);
    this.handleWishlistClick = this.handleWishlistClick.bind(this);
    this.handleWishlistChange = this.handleWishlistChange.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.openCreateWishlistDialog = this.openCreateWishlistDialog.bind(this);
    this.openUpdateWishlistDialog = this.openUpdateWishlistDialog.bind(this);
    this.openDeleteWishlistDialog = this.openDeleteWishlistDialog.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleCreateWishlist = this.handleCreateWishlist.bind(this);
    this.handleUpdateWishlist = this.handleUpdateWishlist.bind(this);
    this.handleDeleteWishlist = this.handleDeleteWishlist.bind(this);
  }

  state = {
    wishlists: [],
    currentIndex: -1,
    pendingWishlistIndex: -1,
    dialogOpen: '',
    formName: ''
  }

  handleLoadWishlists() {
    fetch('wishlists/')
    .then(response => { return response.json(); })
    .then(data => {
      let newState = { wishlists: data.wishlists };
      if (this.state.currentIndex < 0 && data.wishlists.length > 0) {
        newState.currentIndex = 0;
      }
      this.setState(newState);
    });
  }

  handleWishlistClick(index) {
    this.setState({ currentIndex: index });
  }

  handleWishlistChange(action, wishlist = undefined) {
    let wishlists = this.state.wishlists;

    let newState = {};
    switch (action) {
      case 'add':
        wishlists.push(wishlist);
        newState.currentIndex = wishlists.length - 1;
        break;
      case 'update':
        wishlists[this.state.currentIndex] = wishlist;
        break;
      case 'delete':
        wishlists.splice(this.state.pendingWishlistIndex, 1);
        if (this.state.currentIndex === this.state.pendingWishlistIndex) {
          newState.currentIndex = wishlists.length - 1;
        }
        break;
    }

    newState.wishlists = wishlists;
    this.setState(newState);
  }

  closeDialog() {
    this.setState({ dialogOpen: '', pendingWishlistIndex: -1, formName: '' });
  }

  openCreateWishlistDialog() {
    this.setState({ dialogOpen: 'createWishlist' });
  }

  openUpdateWishlistDialog(index) {
    let wishlist = this.state.wishlists[index];
    this.setState({ dialogOpen: 'updateWishlist', pendingWishlistIndex: index, formName: wishlist.name });
  }

  openDeleteWishlistDialog(index, e) {
    e.stopPropagation();
    let wishlist = this.state.wishlists[index];
    this.setState({ dialogOpen: 'deleteWishlist', pendingWishlistIndex: index, formName: wishlist.name });
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
    .then(response => { return response.json(); })
    .then(data => {
      this.handleWishlistChange('add', data.wishlist);
      this.closeDialog();
    });
  }

  handleUpdateWishlist() {
    let wishlist = this.state.wishlists[this.state.pendingWishlistIndex];
    const url = wishlist.id + '/update';
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
    .then(response => { return response.json(); })
    .then(data => {
      this.handleWishlistChange('update', data.wishlist);
      this.closeDialog();
    });
  }

  handleDeleteWishlist() {
    let wishlist = this.state.wishlists[this.state.pendingWishlistIndex];
    const url = wishlist.id + '/delete';
    fetch(url, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: {}
    })
    .then(response => {
      this.handleWishlistChange('delete');
      this.closeDialog();
    });
  }

  componentDidMount() {
    this.handleLoadWishlists();
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

    const labelStyle = {
      width: 100,
      display: 'inline-block'
    }

    /* components */
    const wishlistForm = (
      <div>
        <label style={labelStyle}>Name:</label>
        <input
          name="formName"
          type="text"
          value={this.state.formName}
          onChange={this.handleFormChange} />
      </div>
    );

    const createWishlistDialog = (
      <Dialog
        visible={this.state.dialogOpen === 'createWishlist'}
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
        {wishlistForm}
      </Dialog>
    );

    const updateWishlistDialog = (
      <Dialog
        visible={this.state.dialogOpen === 'updateWishlist'}
        title='Update Wishlist'
        buttons={[
          {
            'name': 'Update',
            'handler': this.handleUpdateWishlist
          },
          {
            'name': 'Cancel',
            'handler': this.closeDialog
          }
        ]}
        width={400}
        height={200}>
        {wishlistForm}
      </Dialog>
    );

    const deleteWishlistDialog = (
      <Dialog
        visible={this.state.dialogOpen === 'deleteWishlist'}
        title='Delete Wishlist'
        buttons={[
          {
            'name': 'Delete',
            'handler': this.handleDeleteWishlist
          },
          {
            'name': 'Cancel',
            'handler': this.closeDialog
          }
        ]}
        width={400}
        height={200}>
        Delete <b>{this.state.formName}</b> wishlist?
      </Dialog>
    );

    let currentWishlist = {};
    if (this.state.currentIndex >= 0 && this.state.currentIndex < this.state.wishlists.length)
      currentWishlist = this.state.wishlists[this.state.currentIndex];

    return (
      <div id='main-panel'>
        <div id='left-panel'>
          <div style={{ height: '100%' }}>
            <div style={{ position: 'relative', height: '39px' }}>
              <h4 style={{ display: 'inline-block' }}>Wishlists</h4>
              <button style={buttonStyle} onClick={this.openCreateWishlistDialog}>Create</button>
            </div>
            <ItemList
              className='wishlists'
              selectedIndex={this.state.currentIndex}
              items={this.state.wishlists}
              onItemClick={this.handleWishlistClick}
              onDeleteItem={this.openDeleteWishlistDialog} />
          </div>
        </div>
        <div id='center-panel'>
          <WishlistDetail
            currentIndex={this.state.currentIndex}
            wishlist={currentWishlist}
            onUpdateWishlist={this.openUpdateWishlistDialog}
            onWishlistChange={this.handleWishlistChange} />
        </div>
        <div id='right-panel'></div>
        {createWishlistDialog}
        {updateWishlistDialog}
        {deleteWishlistDialog}
      </div>
    );
  }
}

export default Wishlist;