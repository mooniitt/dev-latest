window.onload = function () {
  const dev = document.querySelector("#kissdev");
  const project_name = dev.getAttribute("project_name");
  const hash = dev.getAttribute("hash");
  const ref = dev.getAttribute("ref");
  const socket = io.connect("ws://101.35.85.83:8080/");

  socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });

  socket.on("broadcast", (...rest) => {
    console.log(...rest);
    // if (rest.hash !== hash) {
    //   alert("page is expired");
    // }
  });

  socket.on("expired", (msg) => {
    SemiUI.Toast.warning({
      content: msg,
      duration: 0,
      onClose: () => {
        socket.open();
      },
    });
    socket.close();
  });
  setInterval(() => {
    socket.emit("update", { project_name, hash });
    console.log(
      `socket.emit("update", { project_name : ${project_name}, hash: ${hash} })`
    );
  }, 5000);
};
