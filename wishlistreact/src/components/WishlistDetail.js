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
    currentId: PropTypes.number.isRequired,
    onUpdateWishlist: PropTypes.func.isRequired
  }

  state = {
    details: {},
    data: [],
    dialogOpen: '',
    pendingItemId: -1,
    formName: '',
    formURL: ''
  }

  handleLoadDetails(id) {
    fetch(id  + '/')
    .then(response => { return response.json(); })
    .then(data => { this.setState({ details: data.details, data: data.results }); });
  }

  closeDialog() {
    this.setState({ dialogOpen: '', pendingItemId: -1, formName: '', formURL: '' });
  }

  openAddItemDialog() {
    this.setState({ dialogOpen: 'addItem' });
  }

  openUpdateItemDialog(item) {
    this.setState({ dialogOpen: 'updateItem', pendingItemId: item.id, formName: item.name, formURL: item.url });
  }

  openDeleteItemDialog(id, e) {
    e.stopPropagation();
    this.setState({ dialogOpen: 'deleteItem', pendingItemId: id });
  }

  handleFormChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    this.setState({ [name]: value });
  }

  handleAddItem() {
    const url = this.props.currentId + '/add_item';
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
    .then(response => { this.closeDialog(); this.handleLoadDetails(this.props.currentId); });
  }

  handleUpdateItem() {
    const url = this.state.pendingItemId + '/update_item';
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
    .then(response => { this.closeDialog(); this.handleLoadDetails(this.props.currentId); });
  }

  handleDeleteItem() {
    const url = this.state.pendingItemId + '/delete_item';
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
    .then(response => { this.closeDialog(); this.handleLoadDetails(this.props.currentId); });
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentId >= 0) {
      this.handleLoadDetails(nextProps.currentId);
    }
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
        Delete this item?
      </Dialog>
    );

    return (
      <div style={{ height: '100%' }}>
        <div style={{ position: 'relative', height: '39px' }}>
          <h4 style={{ display: 'inline-block' }} onClick={() => this.props.onUpdateWishlist(this.state.details)}>{this.state.details.name}</h4>
          <button style={buttonStyle} onClick={this.openAddItemDialog}>Add Item</button>
        </div>
        <ItemTable
          className='wishlistitems'
          columns={tableColumns}
          data={this.state.data}
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