import React from 'react';

import './dashboard.scss';

/* eslint-disable-next-line */
export interface DashboardProps {
  organization: string;
}

export const Dashboard = (props: DashboardProps) => {
  this.state = {
    organization: props.organization || 'ampf'
  };

  return (
    <div>
      <h1>Welcome to {this.state.organization} dashboard component!</h1>
      <CustomerCard></CustomerCard>
    </div>
  );
};

export default Dashboard;
