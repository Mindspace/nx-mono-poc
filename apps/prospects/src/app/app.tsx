import './app.scss';

import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { ProspectsUi } from '@poc/prospects/ui';

export const App = () => {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./${fileName}.${style} file.
   */
  return (
    <div className="app">
      <header className="flex">
        <h1>Welcome to Prospects!</h1>
      </header>

      <Route path="/prospects" exact={true} component={ProspectsUi} />
      <Redirect from="*" to="/prospects" />
    </div>
  );
};

export default App;
