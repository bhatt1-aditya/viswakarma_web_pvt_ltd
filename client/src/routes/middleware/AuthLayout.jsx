import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
const AuthLayout = (props) => {
  return (
    <React.Fragment>
      <DashboardLayout>{props.children}</DashboardLayout>
    </React.Fragment>
  );
};

export default AuthLayout;
