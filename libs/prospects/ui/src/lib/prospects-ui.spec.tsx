import React from 'react';
import { render } from '@testing-library/react';

import ProspectsUi from './prospects-ui';

describe(' ProspectsUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProspectsUi />);
    expect(baseElement).toBeTruthy();
  });
});
