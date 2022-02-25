import React, { useEffect, Component } from "react";
import io from "socket.io-client";
import ReactJson from "react-json-view";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  server = "http://localhost:3030";
  constructor(props) {
    super(props);
    this.state = {
      jsonObject: [],
    };
  }

  componentDidMount() {
    window.addEventListener("beforeunload", (ev) => {
      ev.preventDefault();
      this.socket.emit("disconect", {
        data: this.state.jsonObject[this.state.jsonObject.length - 1],
      });
    });
    this.socket = io(this.server);

    this.socket.on("socketConnected", (data) => {
      this.socket.emit("fontEndConnected", "hello");
    });

    this.socket.on("incomingData", (msg) => {
      this.setState({
        jsonObject: [...this.state.jsonObject, msg],
      });
    });
  }

  componentWillUnmount() {
    this.socket.emit("disconect", "disconect");
    this.socket.disconnect();
  }

  render() {
    return (
      <div>
        {this.state.jsonObject.map((i, index) => {
          return <ReactJson src={i} collapsed={true} key={index} />;
        })}
      </div>
    );
  }
}

export default App;
