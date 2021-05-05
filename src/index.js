import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, withRouter } from "react-router-dom";
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'semantic-ui-css/semantic.min.css';
import login from "./components/Auth/Login"
import Register from "./components/Auth/Register";
import App from "./components/App";
import firebase from "./Firebase/firebase";

const Root = (props) => {

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user);
        props.history.push("/");
      }
    })
  }, [props.history])

  return (

    <Switch>
      <Route path="/" exact component={App} />
      <Route path="/login" exact component={login} />
      <Route path="/register" exact component={Register} />
    </Switch>

  )
};

const RootWithAuth = withRouter(Root);

ReactDOM.render(<Router><RootWithAuth /> </Router>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
