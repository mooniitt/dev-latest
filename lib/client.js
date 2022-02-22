"use strict";
window.onload = function () {
  const e = document.querySelector("#kissdev"),
    t = e.getAttribute("project_name"),
    o = e.getAttribute("hash");
  e.getAttribute("ref");
  const n = io.connect("ws://101.35.85.83:8080/");
  n.on("connect", () => {
    console.log(n.id);
  }),
    n.on("broadcast", (...e) => {
      console.log(...e);
    }),
    n.on("expired", (e) => {
      SemiUI.Toast.warning({
        content: e,
        duration: 0,
        onClose: () => {
          n.open();
        },
      }),
        n.close();
    }),
    setInterval(() => {
      n.emit("update", { project_name: t, hash: o }),
        console.log(
          `socket.emit("update", { project_name : ${t}, hash: ${o} })`
        );
    }, 5e3);
};
