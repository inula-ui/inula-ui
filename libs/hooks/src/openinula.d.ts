/* eslint-disable @typescript-eslint/consistent-type-imports */
declare module 'openinula' {
  import _ from 'openinula/build/@types/index.d';
  import React from 'react';
  import ReactDOM from 'react-dom';

  export const createStore = _.createStore;
  export const useStore = _.useStore;

  export const createRoot = ReactDOM.createRoot;
  export const createPortal = ReactDOM.createPortal;
  export const flushSync = ReactDOM.flushSync;

  export = React;
}
