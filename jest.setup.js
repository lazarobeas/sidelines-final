const React = require('react');
global.React = React;

// Mock scrollIntoView
if (typeof window === 'object') {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
} else {
  global.HTMLElement = class HTMLElement {
    scrollIntoView() {}
  };
  HTMLElement.prototype.scrollIntoView = jest.fn();
}