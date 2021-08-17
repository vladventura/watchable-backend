let rooms = [];
const roomInitial = {
  id: "",
  reducedId: "",
  videos: [],
  remotes: [],
};
let videos = [];

const createRoom = (roomInfo) => {
  const newRoom = {
    ...roomInitial,
    id: roomInfo.id,
    reducedId: roomInfo.reducedId,
  };
  rooms.push(newRoom);
};

const findRoom = (reducedId) => {
  console.log(rooms);
  let r;
  rooms.forEach((room) => {
    console.log(room.reducedId === reducedId);
    if (room.reducedId === reducedId) {
      r = room;
      return;
    }
  });
  console.log(r);
  return r;
};

const joinRoom = (remoteId, roomInfo) => {
  roomInfo.remotes = [...roomInfo.remotes, remoteId];
};

const addVideo = (video) => {
  if (!videos.find((vid) => vid.id === video.id)) videos.push(video);
};

const getVideos = () => {
  return videos;
};

const removeVideo = (video) => {
  videos = videos.filter((vid) => vid.id != video.id);
};

const popVideo = () => videos.shift();

module.exports = {
  addVideo,
  createRoom,
  findRoom,
  getVideos,
  joinRoom,
  removeVideo,
  popVideo,
};
