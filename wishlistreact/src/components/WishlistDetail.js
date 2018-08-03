import React, { Component } from "react";
import PropTypes from "prop-types";

class WishlistDetail extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired
  };

  state = {
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
      .then(data => { this.setState({ data: data.results }); });
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
      .then(this.loadDetails(this.props.id));
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.id >= 0) {
      this.loadDetails(nextProps.id);
    }
  }

  render() {
    const columns = [
      {
        'key': 'name',
        'header': 'Name'
      },
      {
        'key': 'url',
        'header': 'URL'
      },
    ]

    const header = columns.map(column =>
      <th key={column.key}>{column.header}</th>
    );

    const rows = this.state.data.map(row =>
      <tr key={row.id}>
        {columns.map(column => <td key={column.key + row.id}>{row[column.key]}</td>)}
        <td key={"delete" + row.id}><button onClick={(e) => this.handleDelete(row.id, e)}>X</button></td>
      </tr>
    );

    return (
      <div>
        <table>
          <thead>
            <tr>
            {header}
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
}

export default WishlistDetail;