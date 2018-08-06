import React, { Component } from 'react';
import PropTypes from 'prop-types';

class WishlistDetail extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired
  };

  state = {
    details: {},
    data: []
  };

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      let cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  loadDetails(id) {
    fetch(id  + '/')
      .then(response => { return response.json(); })
      .then(data => { this.setState({ details: data.details, data: data.results }); });
  }

  handleDelete(id, e) {
    e.preventDefault();

    const url = id + '/delete_item';
    const csrftoken = this.getCookie('csrftoken');

    fetch(url, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
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
    const buttonStyle = {
      height: 20,
      width: 50,
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
      <thead key='headers'>
        <tr style={{ textAlign: 'left' }}>
          {columns.map(column => <th key={column.key} style={thStyle}>{column.header}</th>)}
          <th key='delete' style={thStyle}>Delete</th>
        </tr>
      </thead>
    );

    const rows = this.state.data.map(row =>
      <tbody key='rows'>
        <tr key={row.id}>
          {columns.map(column => <td key={column.key + row.id} style={tdStyle}>{row[column.key]}</td>)}
          <td key={'delete' + row.id} style={tdStyle}><button onClick={(e) => this.handleDelete(row.id, e)}>X</button></td>
        </tr>
      </tbody>
    );

    return (
      <div style={{ height: '100%' }}>
        <div style={{ position: 'relative', height: '39px' }}>
          <h4 style={{ display: 'inline-block' }}>{this.state.details.name}</h4>
          <button style={buttonStyle}>Add</button>
        </div>
        <div id='wishlist'>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            {header}
            {rows}
          </table>
        </div>
      </div>
    );
  }
}

export default WishlistDetail;