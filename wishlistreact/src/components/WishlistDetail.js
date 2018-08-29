import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ItemTable from './ItemTable';
import Dialog from './Dialog';
import { getCookie } from '../utils';

class WishlistDetail extends Component {
  constructor(props) {
    super(props);

    this.closeDialog = this.closeDialog.bind(this);
    this.openAddItemDialog = this.openAddItemDialog.bind(this);
    this.openUpdateItemDialog = this.openUpdateItemDialog.bind(this);
    this.openDeleteItemDialog = this.openDeleteItemDialog.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleUpdateItem = this.handleUpdateItem.bind(this);
    this.handleDeleteItem = this.handleDeleteItem.bind(this);
  }

  static propTypes = {
    currentIndex: PropTypes.number.isRequired,
    wishlist: PropTypes.object.isRequired,
    onUpdateWishlist: PropTypes.func.isRequired,
    onWishlistChange: PropTypes.func.isRequired
  }

  state = {
    dialogOpen: '',
    pendingItemIndex: -1,
    formName: '',
    formURL: ''
  }

  closeDialog() {
    this.setState({ dialogOpen: '', pendingItemId: -1, formName: '', formURL: '' });
  }

  openAddItemDialog() {
    this.setState({ dialogOpen: 'addItem' });
  }

  openUpdateItemDialog(index) {
    let item = this.props.wishlist.items[index];
    this.setState({ dialogOpen: 'updateItem', pendingItemIndex: index, formName: item.name, formURL: item.url });
  }

  openDeleteItemDialog(index, e) {
    e.stopPropagation();
    let item = this.props.wishlist.items[index];
    this.setState({ dialogOpen: 'deleteItem', pendingItemIndex: index, formName: item.name });
  }

  handleFormChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    this.setState({ [name]: value });
  }

  handleAddItem() {
    const url = this.props.wishlist.id + '/add_item';
    fetch(url, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({
        'name': this.state.formName,
        'url': this.state.formURL
      })
    })
    .then(response => { return response.json(); })
    .then(data => {
      this.props.onWishlistChange('update', data.wishlist);
      this.closeDialog();
    });
  }

  handleUpdateItem() {
    let item = this.props.wishlist.items[this.state.pendingItemIndex];
    const url = item.id + '/update_item';
    fetch(url, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({
        'name': this.state.formName,
        'url': this.state.formURL
      })
    })
    .then(response => { return response.json(); })
    .then(data => {
      this.props.onWishlistChange('update', data.wishlist);
      this.closeDialog();
     });
  }

  handleDeleteItem() {
    let item = this.props.wishlist.items[this.state.pendingItemIndex];
    const url = item.id + '/delete_item';
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
    .then(response => { return response.json(); })
    .then(data => {
      this.props.onWishlistChange('update', data.wishlist);
      this.closeDialog();
     });
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
    const itemForm = (
      <div>
        <label style={labelStyle}>Name:</label>
        <input
          name="formName"
          type="text"
          value={this.state.formName}
          onChange={this.handleFormChange} />
        <br />
        <label style={labelStyle}>URL:</label>
        <input
          name="formURL"
          type="text"
          value={this.state.formURL}
          onChange={this.handleFormChange} />
      </div>
    );

    const tableColumns = [
      {
        'key': 'name',
        'header': 'Name'
      },
      {
        'key': 'url',
        'header': 'URL'
      },
    ];

    const addItemDialog = (
      <Dialog
        visible={this.state.dialogOpen === 'addItem'}
        title='Add Item'
        buttons={[
          {
            'name': 'Add',
            'handler': this.handleAddItem
          },
          {
            'name': 'Cancel',
            'handler': this.closeDialog
          }
        ]}
        width={400}
        height={200}>
        {itemForm}
      </Dialog>
    );

    const updateItemDialog = (
      <Dialog
        visible={this.state.dialogOpen === 'updateItem'}
        title='Update Item'
        buttons={[
          {
            'name': 'Update',
            'handler': this.handleUpdateItem
          },
          {
            'name': 'Cancel',
            'handler': this.closeDialog
          }
        ]}
        width={400}
        height={200}>
        {itemForm}
      </Dialog>
    );

    const deleteItemDialog = (
      <Dialog
        visible={this.state.dialogOpen === 'deleteItem'}
        title='Delete Item'
        buttons={[
          {
            'name': 'Delete',
            'handler': this.handleDeleteItem
          },
          {
            'name': 'Cancel',
            'handler': this.closeDialog
          }
        ]}
        width={400}
        height={200}>
        Delete <b>{this.state.formName}</b> item?
      </Dialog>
    );

    let items = this.props.wishlist.hasOwnProperty('items') ? this.props.wishlist.items : [];

    return (
      <div style={{ height: '100%' }}>
        <div style={{ position: 'relative', height: '39px' }}>
          <h4 style={{ display: 'inline-block' }} onClick={() => this.props.onUpdateWishlist(this.props.currentIndex)}>{this.props.wishlist.name}</h4>
          <button style={buttonStyle} disabled={this.props.currentIndex === -1} onClick={this.openAddItemDialog}>Add Item</button>
        </div>
        <ItemTable
          className='wishlistitems'
          columns={tableColumns}
          items={items}
          onItemClick={this.openUpdateItemDialog}
          onDeleteItem={this.openDeleteItemDialog} />
        {addItemDialog}
        {updateItemDialog}
        {deleteItemDialog}
      </div>
    );
  }
}

export default WishlistDetail;