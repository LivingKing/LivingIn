import React, { Component } from "react";
import { Route } from "react-router-dom";
import MainPage from "./views/mainPage/Main";
import LoginPage from "./views/loginPage/Login";
import RegisterPage from "./views/RegisterPage/Register";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Route exact path="/" component={MainPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={RegisterPage} />
        </header>
      </div>
    );
  }
}

export default App;
