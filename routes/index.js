const express = require("express");
const router = express.Router();
const axios = require("axios");

function decodeHtmlNumeric(str) {
  return str
    .replace(/&#([0-9]{1,7});/g, function (g, m1) {
      return String.fromCharCode(parseInt(m1, 10));
    })
    .replace(/&#[xX]([0-9a-fA-F]{1,6});/g, function (g, m1) {
      return String.fromCharCode(parseInt(m1, 16));
    });
}

router.get("/searchVideo", (req, res) => {
  const searchString = req.query.search;
  if (searchString) {
    axios
      .get(
        `https://youtube.googleapis.com/youtube/v3/search?q=${searchString}&key=${process.env.YOUTUBE_API_KEY}&type=video&maxResults=25&part=snippet`
      )
      .then((response) => {
        const { data } = response;
        const videos = [];
        data.items.map((item) => {
          videos.push({
            id: item.id.videoId,
            etag: item.etag,
            title: decodeHtmlNumeric(item.snippet.title),
            channelTitle: decodeHtmlNumeric(item.snippet.channelTitle),
            thumbnails: item.snippet.thumbnails,
          });
        });
        res.send(videos);
      })
      .catch((err) => console.log(err));
  }
});

router.post;

module.exports = { router };
