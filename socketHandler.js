const NEW_VIDEO_ADDED = "new-video-added";
const VIDEO_REMOVED = "video-removed";
const CREATE_ROOM = "create-room";
const ROOM_CREATED = "room-created";
const JOIN_ROOM = "join-room";
const JOINED_SUCCESS = "joined-success";
const REMOTE_JOINED = "remote-joined";
const REMOVE_VIDEO = "remove-video";
const ROOM_NOT_FOUND = "room-not-found";
const ADD_VIDEO = "add-video";
const ADD_VIDEO_FAILED = "add-video-failed";
const FINISHED_CURRENT_VIDEO = "finished-current-video";
const GET_VIDEOS = "get-videos";

const {
  addVideo,
  createRoom,
  findRoom,
  getVideos,
  joinRoom,
  removeVideo,
  popVideo,
  getRooms,
  deleteRoom,
} = require("./dbHandler");
const { customAlphabet } = require("nanoid");

const generateReducedId = () => {
  const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 5);
  return nanoid();
};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Connection received, socket id: ", socket.id);
    socket.on(CREATE_ROOM, () => {
      let roomInfo = {
        id: "",
        reducedId: "",
      };
      roomInfo.id = socket.id;
      roomInfo.reducedId = generateReducedId();
      createRoom(roomInfo);
      socket.join(roomInfo.id);
      socket.emit(ROOM_CREATED, roomInfo);
      io.to(roomInfo.id).emit(GET_VIDEOS, getVideos(roomInfo.id));
      console.log(
        "Room created, room info: ",
        roomInfo,
        getVideos(roomInfo.id),
        getRooms()
      );
    });

    socket.on(JOIN_ROOM, (reducedId) => {
      const roomInfo = findRoom(reducedId);
      if (roomInfo) {
        console.log(roomInfo.toJson());
        joinRoom(socket.id, roomInfo);
        socket.join(roomInfo.id);
        socket.emit(JOINED_SUCCESS, roomInfo.toJson());
        io.to(roomInfo.id).emit(REMOTE_JOINED);
      } else {
        socket.emit(ROOM_NOT_FOUND);
      }
    });

    socket.on(REMOVE_VIDEO, (video) => {
      removeVideo(video, socket.id);
    });

    socket.on(ADD_VIDEO, (video) => {
      const socketRoomsIterator = socket.rooms.values();
      socketRoomsIterator.next();
      const playerRoomId = socketRoomsIterator.next().value;
      if (addVideo(video, playerRoomId)) {
        console.log("Added video: ", video, " to room: ", playerRoomId);
        io.to(playerRoomId).emit(NEW_VIDEO_ADDED, getVideos(playerRoomId));
      } else {
        console.log("Failed to add video: ", video, " to room: ", playerRoomId);
        socket.emit(ADD_VIDEO_FAILED);
      }
    });

    socket.on(FINISHED_CURRENT_VIDEO, () => {
      console.log("Popping video from room: ", socket.id);
      popVideo(socket.id);
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected, socket id:", socket.id);
      deleteRoom(socket.id);
      console.log("Current state of rooms: ", getRooms());
    });
  });
};

module.exports = {
  NEW_VIDEO_ADDED,
  VIDEO_REMOVED,
  socketHandler,
};
