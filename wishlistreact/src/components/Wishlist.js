import React, { Component } from 'react';
import WishlistList from './WishlistList';
import WishlistDetail from './WishlistDetail';
import Dialog from './Dialog';
import { getCookie } from '../utils';

class Wishlist extends Component {
  constructor(props) {
    super(props);
    
    this.handleLoadWishlists = this.handleLoadWishlists.bind(this);
    this.handleWishlistClick = this.handleWishlistClick.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.openCreateWishlistDialog = this.openCreateWishlistDialog.bind(this);
    this.openDeleteWishlistDialog = this.openDeleteWishlistDialog.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleCreateWishlist = this.handleCreateWishlist.bind(this);
    this.handleDeleteWishlist = this.handleDeleteWishlist.bind(this);
  }

  state = {
    data: {
      'results': []
    },
    currentId: -1,
    dialogOpen: '',
    pendingWishlistId: -1,
    formName: ''
  }

  handleLoadWishlists() {
    fetch('wishlists/')
    .then(response => { return response.json(); })
    .then(data => {
      let newState = { data: data };
      if (this.state.currentId < 0 && data.results.length > 0) {
        newState.currentId = data.results[0].id;
      }
      this.setState(newState);
    });
  }

  handleWishlistClick(id) {
    this.setState({ currentId: id });
  }

  closeDialog() {
    this.setState({ dialogOpen: false, pendingWishlistId: -1, formName: '' });
  }

  openCreateWishlistDialog() {
    this.setState({ dialogOpen: 'createWishlist' });
  }

  openDeleteWishlistDialog(id, e) {
    e.stopPropagation();
    this.setState({ dialogOpen: 'deleteWishlist', pendingWishlistId: id });
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
    .then(response => { this.closeDialog(); this.handleLoadWishlists(); });
  }

  handleDeleteWishlist() {
    const url = this.state.pendingWishlistId + '/delete';
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
      if (this.state.currentId === this.state.pendingWishlistId) {
        this.setState({ currentId: -1 });
      }
      this.closeDialog();
      this.handleLoadWishlists();
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

    /* components */
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
        Delete this wishlist?
      </Dialog>
    );

    return (
      <div id='main-panel'>
        <div id='left-panel'>
          <div style={{ height: '100%' }}>
            <div style={{ position: 'relative', height: '39px' }}>
              <h4 style={{ display: 'inline-block' }}>Wishlists</h4>
              <button style={buttonStyle} onClick={this.openCreateWishlistDialog}>Create</button>
            </div>
            <WishlistList
              currentId={this.state.currentId}
              wishlists={this.state.data.results}
              onWishlistClick={this.handleWishlistClick}
              onDeleteWishlist={this.openDeleteWishlistDialog} />
          </div>
        </div>
        <div id='center-panel'>
          <WishlistDetail currentId={this.state.currentId} />
        </div>
        <div id='right-panel'></div>
        {createWishlistDialog}
        {deleteWishlistDialog}
      </div>
    );
  }
}

export default Wishlist;