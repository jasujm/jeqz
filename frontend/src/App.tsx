import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.scss";
import HomeView from "./views/HomeView";
import QuizView from "./views/QuizView";
import AboutView from "./views/AboutView";
import { Navbar, Nav } from "react-bootstrap";

export default function App() {
  return (
    <Router>
      <div className="app">
        <Navbar>
          <Navbar.Brand as={Link} to="/">
            Jaakko’s equation quiz
          </Navbar.Brand>
          <Nav>
            <Nav.Link as={Link} to="/about">
              About
            </Nav.Link>
          </Nav>
        </Navbar>
        <main>
          <Switch>
            <Route path="/quizzes/:id">
              <QuizView />
            </Route>
            <Route path="/about">
              <AboutView />
            </Route>
            <Route path="/">
              <HomeView />
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}
