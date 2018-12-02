import React, { Component } from "react";
import logo from "./logo.svg";
import axios from "axios";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      itemsArr: []
    };
  }
  componentDidMount() {
    axios.get("http://165.227.30.20/api/getNotes").then(res => {
      this.setState({
        itemsArr: res.data
      });
    });
  }
  render() {
    let reverseArr = this.state.itemsArr.reverse();
    let mapOverItems = reverseArr.map(element => {
      return (
        <li
          style={{
            marginLeft: "50px",
            marginRight: "50px",
            borderBottom: "1px solid white"
          }}
        >
          {element.description}
        </li>
      );
    });
    return (
      <div className="App">
        <header className="App-header">
          <h2>Personal Assistant Bot 🤖</h2>
          <br />
          <h3>Your Notes:</h3>
          <ol
            style={{
              textAlign: "left",
              border: "2px solid white",
              padding: "30px"
            }}
          >
            {mapOverItems.length > 0 ? (
              mapOverItems
            ) : (
              <p>You dont have any notes yet!</p>
            )}
          </ol>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          />
        </header>
      </div>
    );
  }
}

export default App;
