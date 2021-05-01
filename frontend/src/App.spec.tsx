import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import chai from 'chai';

const expect = chai.expect;

describe('App', () => {
  it('should have tests', () => {
    render(<App />);
    expect(1 + 1).to.equal(2);
  });
});
