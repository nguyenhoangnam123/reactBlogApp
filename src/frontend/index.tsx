import * as React from "react";
import * as ReactDom from "react-dom";

const Hello = () => {
  console.log("hey iam there");
  return <>Hello</>;
};

ReactDom.render(<Hello />, document.getElementById("root") as HTMLDivElement);
