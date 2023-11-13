import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import './global.css';
import reportWebVitals from './reportWebVitals';

import Root from './routes/root';
import Layout from './routes/layout';
import { SessionProvider } from './components/SessionContext/SessionContext';
import Login from './routes/login';
import OAuth from './routes/oauth';
import Logout from './routes/logout';
import { ManifestProvider } from './components/ManifestContext/ManifestContext';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={ <Layout /> }>
      <Route path="/" element={ <Root /> } />
      <Route path="/login" element={ <Login /> } />
      <Route path="/login/oauth" element={ <OAuth /> } />
      <Route path="/logout" element={ <Logout /> } />
    </Route>
  ));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <SessionProvider>
      <ManifestProvider>
        <RouterProvider router={ router } />
      </ManifestProvider>
    </SessionProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
