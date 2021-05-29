import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";
import HomeView from "./views/HomeView";
import QuizView from "./views/QuizView";

export default function App() {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/quizzes/:id">
            <QuizView />
          </Route>
          <Route path="/">
            <HomeView />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
