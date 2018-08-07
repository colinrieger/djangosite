import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WishlistItemTable from './WishlistItemTable';
import Dialog from './Dialog';
import { getCookie } from '../utils';

class WishlistDetail extends Component {
  constructor(props) {
    super(props);

    this.closeDialog = this.closeDialog.bind(this);
    this.openAddItemDialog = this.openAddItemDialog.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleDeleteItem = this.handleDeleteItem.bind(this);
  }

  static propTypes = {
    id: PropTypes.number.isRequired
  }

  state = {
    details: {},
    data: [],
    dialogOpen: false,
    formName: '',
    formURL: ''
  }

  loadDetails(id) {
    fetch(id  + '/')
    .then(response => { return response.json(); })
    .then(data => { this.setState({ details: data.details, data: data.results }); });
  }

  closeDialog() {
    this.setState({ dialogOpen: false, formName: '', formURL: '' });
  }

  openAddItemDialog() {
    this.setState({ dialogOpen: true });
  }

  handleFormChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    this.setState({ [name]: value });
  }

  handleAddItem() {
    const url = this.props.id + '/add_item';
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
    .then(response => { this.closeDialog(); this.loadDetails(this.props.id); });
  }

  handleDeleteItem(id, e) {
    e.preventDefault();

    const url = id + '/delete_item';
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
    .then(response => { this.loadDetails(this.props.id); });
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.id >= 0) {
      this.loadDetails(nextProps.id);
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

    /* components */
    const addItemDialog = (
      <Dialog
        visible={this.state.dialogOpen}
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
        <label>
          Name:
          <input
            name="formName"
            type="text"
            value={this.state.formName}
            onChange={this.handleFormChange} />
        </label>
        <br />
        <label>
          URL:
          <input
            name="formURL"
            type="text"
            value={this.state.formURL}
            onChange={this.handleFormChange} />
        </label>
      </Dialog>
    );

    return (
      <div style={{ height: '100%' }}>
        <div style={{ position: 'relative', height: '39px' }}>
          <h4 style={{ display: 'inline-block' }}>{this.state.details.name}</h4>
          <button style={buttonStyle} onClick={this.openAddItemDialog}>Add Item</button>
        </div>
        <WishlistItemTable data={this.state.data} onDeleteItem={this.handleDeleteItem} />
        {addItemDialog}
      </div>
    );
  }
}

export default WishlistDetail;