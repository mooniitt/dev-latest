import React from "react";
import ReactDom from "react-dom";
import { Button } from "antd";
import "antd/dist/antd.less";

const root = document.createElement("div");

ReactDom.render(
  <div>
    <Button
      type="primary"
      onClick={e => {
        alert("button");
      }}
    >
      lala
    </Button>
  </div>,
  root
);

document.body.appendChild(root);
