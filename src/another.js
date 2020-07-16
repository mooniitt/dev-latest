function genComponent() {
  return import(/* webpackChunkName:"lodash" */ "lodash").then(_ => {
    const element = document.createElement("div");
    element.innerHTML = _.join(["hello", "dynamic import"]);
    return element;
  });
}

function done() {
  genComponent().then(ele => {
    document.body.appendChild(ele);
  });
}

const body = document.querySelector("body");
const element = document.createElement("button");
element.innerHTML = "button";
element.onclick = done;
body.appendChild(element);
