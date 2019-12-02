import './app.scss';

import React from 'react';
import { Link, Route, Redirect } from 'react-router-dom';

import { AccountsUi } from '@poc/accounts/ui';

export const App = () => {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./${fileName}.${style} file.
   */
  return (
    <div className="app">
      <header className="flex">
        <h1>Welcome to accounts!</h1>
      </header>

      <Route path="/accounts" exact={true} component={AccountsUi} />
      <Redirect from="*" to="/accounts" />
    </div>
  );
};

export default App;
