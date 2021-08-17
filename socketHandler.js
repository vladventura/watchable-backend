const NEW_VIDEO_ADDED = "new-video-added";
const VIDEO_REMOVED = "video-removed";
const {
  addVideo,
  createRoom,
  findRoom,
  getVideos,
  joinRoom,
  removeVideo,
  popVideo,
} = require("./dbHandler");
const { customAlphabet } = require("nanoid");

const generateReducedId = () => {
  const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 5);
  return nanoid();
};

const roomInfoInitial = {
  id: "",
  reducedId: "",
};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    socket.on("create-room", () => {
      let roomInfo = { ...roomInfoInitial };
      roomInfo.id = socket.id;
      roomInfo.reducedId = generateReducedId();
      createRoom(roomInfo);
      socket.join(roomInfo.id);
      socket.emit("room-created", roomInfo);
    });

    socket.on("join-room", (reducedId) => {
      const roomInfo = findRoom(reducedId);
      console.log(roomInfo);
      if (roomInfo) {
        joinRoom(socket.id, roomInfo);
        socket.join(roomInfo.id);
        socket.emit("joined-success", roomInfo);
        io.to(roomInfo.id).emit("remote-joined");
      } else {
        socket.emit("room-not-found");
      }
    });

    socket.on("remove-video", (video) => {
      removeVideo(video);
    });
    socket.on("add-video", (video) => {
      console.log("Adding video, ", video);
      addVideo(video);
      io.emit("new-video-added", getVideos());
    });
    socket.on("finished-current-video", popVideo);
    socket.on("disconnect", () => {
      console.log("GOODBYE BRUH");
    });
    socket.emit("get-videos", getVideos());
  });
};

module.exports = {
  NEW_VIDEO_ADDED,
  VIDEO_REMOVED,
  socketHandler,
};
