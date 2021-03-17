import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import login from "./Auth/Login";
import Register from "./Auth/Register";
import Home from "./Home/Home";
import "./App.css"
const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" exact component={login} />
        <Route path="/register" exact component={Register} />
      </Switch>
    </Router>
  )
};

export default App;
