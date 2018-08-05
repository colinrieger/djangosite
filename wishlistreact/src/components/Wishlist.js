import React, { Component } from "react";
import WishlistList from "./WishlistList";
import WishlistDetail from "./WishlistDetail";

class Wishlist extends Component {
  constructor(props) {
    super(props);
    this.handleListClick = this.handleListClick.bind(this);
  }

  state = {
    data: {
      'results': []
    },
    currentId: -1
  };

  componentDidMount() {
    fetch('lists/')
      .then(response => { return response.json(); })
      .then(data => {
        let newState = { data: data };
        if (this.state.currentId < 0 && data.results.length > 0) {
          newState.currentId = data.results[0].id;
        }
        this.setState(newState);
      });
  }

  handleListClick(id) {
    this.setState({ currentId: id });
  }

  render() {
    return (
      <div id="main-panel">
        <div id="left-panel">
          <WishlistList currentId={this.state.currentId} lists={this.state.data.results} onListClick={this.handleListClick} />
        </div>
        <div id="center-panel">
          <WishlistDetail id={this.state.currentId} />
        </div>
        <div id="right-panel"></div>
      </div>
    );
  }
}

export default Wishlist;