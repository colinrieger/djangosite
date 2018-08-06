import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from './Dialog';
import { getCookie } from '../utils';

class WishlistDetail extends Component {
  constructor(props) {
    super(props);

    this.closeDialog = this.closeDialog.bind(this);
    this.openAddItemDialog = this.openAddItemDialog.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
  }

  static propTypes = {
    id: PropTypes.number.isRequired
  };

  state = {
    details: {},
    data: [],
    dialogOpen: false,
    formName: '',
    formURL: ''
  };

  loadDetails(id) {
    fetch(id  + '/')
      .then(response => { return response.json(); })
      .then(data => { this.setState({ details: data.details, data: data.results }); });
  }

  handleDelete(id, e) {
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
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.id >= 0) {
      this.loadDetails(nextProps.id);
    }
  }

  render() {
    const buttonStyle = {
      height: 20,
      display: 'inline-block',
      position: 'absolute',
      right: 0,
      bottom: 0,
      marginBottom: 10
    };

    const thStyle = {
      borderBottom: '1px solid black'
    };

    const tdStyle = {
      borderBottom: '1px solid #D3D3D3'
    };

    const columns = [
      {
        'key': 'name',
        'header': 'Name'
      },
      {
        'key': 'url',
        'header': 'URL'
      },
    ];

    const header = (
      <tr style={{ textAlign: 'left' }}>
        {columns.map(column => <th key={column.key} style={thStyle}>{column.header}</th>)}
        <th key='delete' style={thStyle}>Delete</th>
      </tr>
    );

    const rows = this.state.data.map(row =>
      <tr key={row.id}>
        {columns.map(column => <td key={column.key + row.id} style={tdStyle}>{row[column.key]}</td>)}
        <td key={'delete' + row.id} style={tdStyle}><button onClick={(e) => this.handleDelete(row.id, e)}>X</button></td>
      </tr>
    );

    return (
      <div style={{ height: '100%' }}>
        <div style={{ position: 'relative', height: '39px' }}>
          <h4 style={{ display: 'inline-block' }}>{this.state.details.name}</h4>
          <button style={buttonStyle} onClick={this.openAddItemDialog}>Add Item</button>
        </div>
        <div id='wishlist'>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead key='headers'>
              {header}
            </thead>
            <tbody key='rows'>
              {rows}
            </tbody>
          </table>
        </div>
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
      </div>
    );
  }
}

export default WishlistDetail;