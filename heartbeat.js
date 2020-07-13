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

const server = new Ws("ws://localhost:8090");

server
  .run()
  .then(socket => {
    setTimeout(() => {
      socket.send("hello");
    }, 10000);
    socket.onmessage = e => {
      console.log("data :", e.data);
    };
    socket.onerror = data => {
      clearInterval(timer);
    };
  })
  .catch(socket => {
    // socket.close();
  });
