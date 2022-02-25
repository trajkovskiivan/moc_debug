const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const fs = require("fs");

const app = express();
const server = http.Server(app);
const io = socketio(server, { cors: { origin: "*" } });
const port = 3030;

app.use(cors());

io.on("connection", (socket) => {
  socket.emit("socketConnected", "Hello world");
  socket.on("fontEndConnected", async (payload) => {
    console.log(`Front end is connected and this is the data: ${payload}`);
    setInterval(() => {
      fs.readFile("./moc_data.json", async (err, data) => {
        if (err) {
          console.error(err);
          return err;
        }
        const newTimestamp = new Date().getTime();
        let match = await JSON.parse(data);
        match.timeStamp = newTimestamp;

        socket.emit("incomingData", match);
      });
    }, 3000);
  });

  socket.on("disconect", async (payload) => {
    console.log("This will be saved ", payload);
  });
});

server.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});
