import React from "react";
import { Container } from "react-bootstrap";
import "./About.scss";

export default function AboutView() {
  return (
    <Container className="about">
      <article>
        <h2>About this page</h2>
        <h3>What is this?</h3>
        <p>
          It’s a quiz to identify equations. More specifically, it generates you
          an infinite stream of questions displaying and equation and asking you
          to identify it by selecting a choice.
        </p>
        <p>
          The source of the equations is Wikipedia. Wikipedia articles are
          published under{" "}
          <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>
          , which allows reusing the content, given proper attribution. To avoid
          spoilers, each equation is cited after answering the question, but I
          believe this still still fulfills the terms of the license.
        </p>
        <p>
          The equations are scraped from{" "}
          <a href="https://en.wikipedia.org/wiki/Wikipedia:Database_download">
            Wikipedia database dump
          </a>
          . The heuristic is to look for articles that have the word “equation”
          in them, and pick the first block level math markup from them. To
          exclude overly general articles (such as “Differential equation”),
          only articles about equations that look like they’re named after one
          or multiple people are included.
        </p>
        <p>
          This heuristic isn’t perfect. If you see something weird,{" "}
          <a href="https://github.com/jasujm/jeqz/issues">feedback</a> is
          welcome.
        </p>
        <h3>Who are you?</h3>
        <p>
          I’m <a href="https://www.jmoisio.eu/">Jaakko Moisio</a>, a software
          engineer and an amateur physicist.
        </p>
        <h3>Why did you do this?</h3>
        <p>
          I love both equations and programming. Also, I wanted a project to
          learn <a href="https://reactjs.org/">React</a>,{" "}
          <a href="https://koajs.com/">Koa</a>, and writing web applications in
          Javascript.
        </p>
        <h3>Where is the code?</h3>
        <p>
          In <a href="https://github.com/jasujm/jeqz">GitHub</a>.
        </p>
        <h3>Are you good in this game?</h3>
        <p>
          I score barely better than a random agent. It’s in fact quite a
          difficult quiz.
        </p>
      </article>
    </Container>
  );
}
