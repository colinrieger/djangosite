import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ItemTable extends Component {
  static propTypes = {
    className: PropTypes.string,
    columns: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    onItemClick: PropTypes.func.isRequired,
    onDeleteItem: PropTypes.func
  }

  render() {
    /* styles */
    const thStyle = {
      borderBottom: '1px solid black'
    };

    const tdStyle = {
      borderBottom: '1px solid #D3D3D3',
      cursor: 'pointer'
    };

    /* components */
    const headers = (
      <tr style={{ textAlign: 'left' }}>
        {this.props.columns.map(column => <th key={column.key} style={thStyle}>{column.header}</th>)}
        { this.props.onDeleteItem ? <th key='delete' style={thStyle}>Delete</th> : "" }
      </tr>
    );

    let rows = "";
    if (this.props.items != null)
      rows = this.props.items.map((row, index) =>
        <tr key={row.id} onClick={() => this.props.onItemClick(index)}>
          {this.props.columns.map(column => <td key={column.key + row.id} style={tdStyle}>{row[column.key]}</td>)}
          { this.props.onDeleteItem ? <td key={'delete' + row.id} style={tdStyle}><button onClick={(e) => this.props.onDeleteItem(index, e)}>X</button></td> : "" }
        </tr>
      );

    return (
      <div className={this.props.className}>
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

export default ItemTable;