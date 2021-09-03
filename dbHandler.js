const Room = require("./models/room");
let rooms = [];

const createRoom = (roomInfo) => {
  const newRoom = new Room(roomInfo.id, roomInfo.reducedId);
  console.log(newRoom.toJson());
  rooms.push(newRoom);
};

const findRoom = (reducedId) => {
  let r;
  rooms.every((room) => {
    console.log(
      "Find Room by Reduced ID Assertion: ",
      room.reducedId === reducedId
    );
    if (room.reducedId === reducedId) {
      r = room;
      return false;
    } else return true;
  });
  return r;
};

const findRoomByMainId = (playerRoomId) => {
  let r;

  rooms.every((room) => {
    console.log("Find Room by Main ID Assertion: ", room.id === playerRoomId);
    if (room.id === playerRoomId) {
      r = room;
      return false;
    } else return true;
  });
  return r;
};

const joinRoom = (remoteId, roomInfo) => {
  roomInfo.addRemote(remoteId);
};

const addVideo = (video, playerRoomId) => {
  const room = findRoomByMainId(playerRoomId);
  console.log("Room to push this video to", room.toJson());
  if (room) return room.addVideo(video);
};

const getVideos = (playerRoomId) => {
  const room = findRoomByMainId(playerRoomId);
  console.log("Get videos on the current room: ", room);
  if (room) return room.videos;
  return [];
};

const removeVideo = (video, playerRoomId) => {
  const room = findRoomByMainId(playerRoomId);
  if (room) room.removeVideo(video);
};

const popVideo = (playerRoomId) => {
  const room = findRoomByMainId(playerRoomId);
  if (room) room.popVideo();
};

const getRooms = () => rooms;

const deleteRoom = (playerRoomId) => {
  for (x = rooms.length - 1; x >= 0; --x) {
    if (rooms[x].id === playerRoomId) {
      // delete rooms[x];
      rooms.splice(x, 1);
      break;
    }
  }
};

module.exports = {
  addVideo,
  createRoom,
  findRoom,
  getVideos,
  joinRoom,
  removeVideo,
  popVideo,
  getRooms,
  deleteRoom,
};
