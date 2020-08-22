import React, { Component } from "react";
import { Route } from "react-router-dom";
import LoginPage from "./views/loginPage/Login";
import Register from "./views/RegisterPage/Register";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={Register} />
        </header>
      </div>
    );
  }
}

export default App;
