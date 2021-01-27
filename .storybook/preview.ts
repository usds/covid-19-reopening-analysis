import { configure } from "@storybook/react";
// const req = ;
// function loadStories() {
//   req.keys().forEach(req);
// }
configure(require.context("../src/stories", true, /\.stories\.tsx$/), module);
