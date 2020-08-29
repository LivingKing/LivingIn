import React, { Component } from "react";
import { Route } from "react-router-dom";
import MainPage from "./views/mainPage/Main";
import LoginPage from "./views/loginPage/Login";
import RegisterPage from "./views/RegisterPage/Register";
import NoMatchPage from "./views/nomatchPage/NoMatch";
import { Switch } from "react-router-dom";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header"></header>
        <content>
          <Switch>
            <Route exact path="/" component={MainPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/register" component={RegisterPage} />
            <Route component={NoMatchPage} />
          </Switch>
        </content>
      </div>
    );
  }
}

export default App;
