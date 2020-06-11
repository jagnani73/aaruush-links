import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import "./App.css";
import Header from "./components/Header/Header";
import Events from "./containers/Events/Events";
import AdminPanel from "./containers/AdminPanel/AdminPanel";
import LogIn from "./containers/LogIn/LogIn";
import NotFound from "./components/NotFound/NotFound";

class App extends Component {
  constructor() {
    super();
    this.state = {
      isAuth: false,
      toAdminLogin: 0,
    };
  }
  componentWillMount() {
    let expirationTime = localStorage.getItem("authTokenExpiration");
    let currentTime = new Date().getTime();
    let forcedLogout = expirationTime - currentTime;
    if (localStorage.getItem("authToken")) {
      if (forcedLogout > 0) {
        this.setState({ isAuth: true });
      } else {
        this.setState({ isAuth: false });
        localStorage.removeItem("authToken");
        localStorage.removeItem("authTokenExpiration");
      }
    }
  }

  render() {
    let authRoutes = (
      <React.Fragment>
        <Switch>
          <Route path="/admin/panel" exact>
            <Redirect to="/admin/login" />
          </Route>

          <Route path="/admin/login" exact>
            <LogIn
              afterLogin={() => this.setState({ isAuth: true })}
              onLogout={() => {
                alert("Session Timeout");
                this.setState({ isAuth: false });
                localStorage.removeItem("authToken");
                localStorage.removeItem("authTokenExpiration");
              }}
            />
          </Route>

          <Route path="/" component={Events} exact />
          <Route path="*" component={NotFound} exact />
        </Switch>
      </React.Fragment>
    );

    if (this.state.isAuth) {
      authRoutes = (
        <React.Fragment>
          <Switch>
            <Route path="/admin/login" exact>
              <Redirect to="/admin/panel" />
            </Route>

            <Route path="/admin/panel" exact>
              <AdminPanel
                onLogout={() => {
                  localStorage.removeItem("authToken");
                  localStorage.removeItem("authTokenExpiration");
                  alert("You are about to be logged out");
                  this.setState({ isAuth: false });
                }}
              />
            </Route>

            <Route path="/" component={Events} exact />
            <Route path="*" component={NotFound} exact />
          </Switch>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <Header
          aaruushLogoClicked={() => {
            if (window.location.pathname === "/") {
              this.setState({ toAdminLogin: this.state.toAdminLogin + 1 });
              if (this.state.toAdminLogin !== 0) {
                setTimeout(() => this.setState({ toAdminLogin: 0 }), 1500);
              }
              if (this.state.toAdminLogin === 5) {
                window.location.pathname = "/admin/login";
              }
            }
          }}
        />
        <Switch>
          <div style={{ position: "relative", minHeight: "100vh" }}>
            {authRoutes}
          </div>
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
