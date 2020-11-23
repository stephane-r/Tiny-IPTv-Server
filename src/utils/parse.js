const fs = require("fs");
const parser = require("iptv-playlist-parser");
const { file } = require("../constants");

const parseM3uFile = () =>
  parser.parse(fs.readFileSync(file, { encoding: "utf8" })).items;

module.exports = {
  parseM3uFile,
};
