import React, { Component } from 'react';
import NavbarComponents from './components/NavbarComponents';
import HomeContainer from './containers/HomeContainer';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Container } from "reactstrap";
import LoginContainer from './containers/LoginContainer';

export default class App extends Component {

  render() {
    return (
      <BrowserRouter>
          <Switch>
            <Route path="/Login" component={LoginContainer}></Route>
            <Route path="/">
              <Container>
                <NavbarComponents />
                <HomeContainer />
              </Container>
            </Route>
          </Switch>
      </BrowserRouter>
    )
  }
}