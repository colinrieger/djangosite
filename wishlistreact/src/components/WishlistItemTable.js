import React, { Component } from 'react';
import PropTypes from 'prop-types';

class WishlistItemTable extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    onDeleteItem: PropTypes.func.isRequired
  }

  render() {
    /* styles */
    const thStyle = {
      borderBottom: '1px solid black'
    };

    const tdStyle = {
      borderBottom: '1px solid #D3D3D3'
    };

    /* components */
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

    const headers = (
      <tr style={{ textAlign: 'left' }}>
        {columns.map(column => <th key={column.key} style={thStyle}>{column.header}</th>)}
        <th key='delete' style={thStyle}>Delete</th>
      </tr>
    );

    const rows = this.props.data.map(row =>
      <tr key={row.id}>
        {columns.map(column => <td key={column.key + row.id} style={tdStyle}>{row[column.key]}</td>)}
        <td key={'delete' + row.id} style={tdStyle}><button onClick={(e) => this.props.onDeleteItem(row.id, e)}>X</button></td>
      </tr>
    );

    return (
      <div id='wishlistitems'>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead key='headers'>
            {headers}
          </thead>
          <tbody key='rows'>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
}

export default WishlistItemTable;