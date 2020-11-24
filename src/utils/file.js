const path = require("path");
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

module.exports = {
  isCacheFileExist,
  getCacheFileData,
};
