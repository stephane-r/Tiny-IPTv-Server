const { parseM3uFile } = require("./parse");
const path = require("path");
const toPascalCase = require("./pascalCase");
const {
  getPlaylistsByChannelGroup,
  getPlaylistsByChannelQuality,
} = require("./filter");

const getCategories = (data) => {
  const categories = [];

  for (const [key] of Object.entries(data)) {
    categories.push(key);
  }

  return categories;
};

const filterDataByCountry = (data, country) =>
  data.filter((p) => p.group.title.includes(`${country} `));

const parseData = (playlistId, country) => {
  const fileData = parseM3uFile(path.resolve(`playlists/${playlistId}.m3u`));
  const playlists = filterDataByCountry(fileData, country);

  return getPlaylistsByChannelQuality(playlists);
};

const getData = (playlistId, country) => {
  const data = parseData(playlistId, country);

  if (!data) {
    return {
      error: "Invalid data",
    };
  }

  return {
    categories: getCategories(data),
    data,
  };
};

module.exports = {
  getCategories,
  parseData,
  getData,
};
