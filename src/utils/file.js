const path = require("path");
const http = require("http");
const fs = require("fs");
const { getCategories } = require("./data");

const isCacheFileExist = (filename) =>
  fs.existsSync(path.resolve(`${filename}.json`));

const getCacheFileContent = (filename) =>
  fs.readFileSync(`${filename}.json`, { encoding: "utf8" });

const getCacheFileData = (filename) => {
  const data = JSON.parse(getCacheFileContent(filename));

  return {
    categories: getCategories(data),
    data,
  };
};

const downloadFile = (url, id) => {
  const file = fs.createWriteStream(path.resolve(`playlists/${id}.m3u`));
  http.get(url, (response) => response.pipe(file));
};

module.exports = {
  isCacheFileExist,
  getCacheFileData,
  downloadFile,
};
