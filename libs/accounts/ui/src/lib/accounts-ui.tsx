import './accounts-ui.scss';

import React from 'react';

import { logger } from '@poc/shared/utils';
import { Session } from '@poc/shared/auth';
import { AuthenticatedUser } from '../../../../shared/auth/src/lib/shared-auth';

/* eslint-disable-next-line */
export interface AccountsUiProps {}

export const AccountsUi = (props: AccountsUiProps) => {
  let obj: AuthenticatedUser;

  return (
    <div>
      <h1>Welcome to accounts-ui component!</h1>
    </div>
  );
};

export default AccountsUi;
