import React from 'react';
import { render } from '@testing-library/react';

import AccountsUi from './accounts-ui';

describe(' AccountsUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AccountsUi />);
    expect(baseElement).toBeTruthy();
  });
});
