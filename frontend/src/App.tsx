import React, { useEffect } from 'react';
import './App.scss';
import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3030',
  timeout: 1000,
})

export default function App() {
  const [greeting, setGreeting] = React.useState('');

  useEffect(() => {
    void client.get('/').then(response => {
      setGreeting(response.data);
    }).catch(err => {
      console.error(err);
    });
  }, []);

  return (
    <div className="App">
      <h1>{greeting}</h1>
    </div>
  );
}
