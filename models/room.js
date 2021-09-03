class Room {
  #videos;
  #remotes;
  #id;
  #reducedId;
  constructor(id, reducedId) {
    this.#videos = [];
    this.#remotes = [];
    this.#id = id;
    this.#reducedId = reducedId;
  }

  get videos() {
    return this.#videos;
  }
  get remotes() {
    return this.#remotes;
  }
  get id() {
    return this.#id;
  }
  get reducedId() {
    return this.#reducedId;
  }

  addVideo(video) {
    if (this.videos.find((vid) => vid.id === video.id)) {
      return false;
    } else {
      this.videos.push(video);
      return true;
    }
  }

  removeVideo(video) {
    this.videos = this.videos.filter((vid) => vid.id !== video.id);
  }

  popVideo() {
    this.videos.shift();
  }

  addRemote(remoteId) {
    this.remotes.push(remoteId);
  }

  toJson() {
    return {
      videos: this.videos,
      remotes: this.remotes,
      id: this.id,
      reducedId: this.reducedId,
    };
  }

  toString() {
    return this.toJson();
  }
}

module.exports = Room;
