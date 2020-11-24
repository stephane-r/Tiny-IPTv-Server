const fs = require("fs");
const parser = require("iptv-playlist-parser");

const parseM3uFile = (file) =>
  parser.parse(fs.readFileSync(file, { encoding: "utf8" })).items;

module.exports = {
  parseM3uFile,
};
