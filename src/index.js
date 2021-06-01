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
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";
import { setUser, clearUser } from "./actions/index";
import Spinner from "./Spinner";
const store = createStore(rootReducer, composeWithDevTools());

const Root = (props) => {
  const { clearUser, setUser, history } = props;
  useEffect(() => {

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user);
        setUser(user);
        history.push("/");
      } else {
        history.push('/login');
        clearUser();
      }
    })
  }, [clearUser, setUser, history])

  return props.isLoading ? <Spinner /> : (

    <Switch>
      <Route path="/" exact component={App} />
      <Route path="/login" exact component={login} />
      <Route path="/register" exact component={Register} />
    </Switch>

  )
};
const mapStateFromProps = state => ({
  isLoading: state.user.isLoading
});

const RootWithAuth = withRouter(connect(mapStateFromProps, { setUser, clearUser })(Root));

ReactDOM.render(<Provider store={store}><Router><RootWithAuth /> </Router> </Provider>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
