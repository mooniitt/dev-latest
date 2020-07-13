class Ws {
  constructor(url) {
    this.connectUrl = url;
  }
  createWebSocket() {
    return new WebSocket(this.connectUrl);
  }
  run() {
    const socket = this.createWebSocket(this.connectUrl);
    return new Promise((resolve, reject) => {
      socket.onopen = e => {
        resolve(socket);
      };
      socket.onerror = e => {
        reject(socket);
      };
    });
  }
}

class View {
  constructor() {
    this.modal = document.createElement("div");
    this.getLatestHash();
  }

  static STATUS = {
    LATEST: 0,
    DATAOUT: 1,
    DISCONNECT: 2
  };

  setStatus(status) {
    const body = document.querySelector("body");
    let style = "";
    switch (status) {
      case View.STATUS.LATEST:
        style =
          "width:20px;height:20px;position:fixed;top:10px;right:10px;opacity:0.8;border-radius:10px;background-color:#33FF39;box-shadow:0 0 6px #000000;";
        break;
      case View.STATUS.DATAOUT:
        style =
          "width:20px;height:20px;position:fixed;top:10px;right:10px;opacity:0.8;border-radius:10px;background-color:#FFF033;box-shadow:0 0 6px #000000;";
        break;
      case View.STATUS.DISCONNECT:
        style =
          "width:20px;height:20px;position:fixed;top:10px;right:10px;opacity:0.8;border-radius:10px;background-color:#FF4933;box-shadow:0 0 6px #000000;";
      default:
        break;
    }
    this.modal.setAttribute("style", style);
    body.append(this.modal);
  }

  getLatestHash() {
    const devTag = document.querySelector("#dev-latest");
    return devTag.attributes.hash.value;
  }
}

const view = new View();

const server = new Ws("ws://localhost:8090");

server
  .run()
  .then(socket => {
    const timer = setTimeout(() => {
      view.setStatus(View.STATUS.DISCONNECT);
    }, 10000);
    socket.onmessage = e => {
      clearTimeout(timer);
      if (e.data === view.getLatestHash()) {
        view.setStatus(View.STATUS.LATEST);
      } else {
        view.setStatus(View.STATUS.DATAOUT);
      }
    };
    socket.onerror = data => {
      clearInterval(timer);
    };
  })
  .catch(socket => {
    // socket.close();
  });
