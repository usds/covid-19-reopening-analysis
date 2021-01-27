import React from "react";

import { withA11y } from "@storybook/addon-a11y";

import App from "App";
// import { appStateStub } from 'appData/dataStub';
import { ApiContainer } from "components/ApiContainer";
export default {
  title: "Report",
  component: App,
  decorators: [withA11y]
};

export const ReportTest = () => <App></App>;
