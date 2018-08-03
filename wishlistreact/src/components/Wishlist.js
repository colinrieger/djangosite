import React, { Component } from "react";
import WishlistList from "./WishlistList";
import WishlistDetail from "./WishlistDetail";

class Wishlist extends Component {
  constructor(props) {
    super(props);
    this.loadList = this.loadList.bind(this);
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

  loadList(id) {
    this.setState({ currentId: id });
  }

  render() {
    return (
      <div>
        <WishlistList lists={this.state.data.results} handleClick={this.loadList} />
        <WishlistDetail id={this.state.currentId} />
      </div>
    );
  }
}

export default Wishlist;