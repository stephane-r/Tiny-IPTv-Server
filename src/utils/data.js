const { parseM3uFile } = require("./parse");
const path = require("path");
const toPascalCase = require("./pascalCase");

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
  const DEFAULT_GROUP_NAME = "Default";
  const SPORT_GROUP_NAME = "Sport";
  const items = [];
  const data = {
    [DEFAULT_GROUP_NAME]: {
      title: DEFAULT_GROUP_NAME,
      items,
    },
    [SPORT_GROUP_NAME]: {
      title: "Sport",
      items,
    },
  };
  let currentGroupName = DEFAULT_GROUP_NAME;

  playlists.map((p) => {
    const isGroupName = p.name.includes("▀▄");
    const isSportChannel = p.group.title.includes(SPORT_GROUP_NAME);

    switch (true) {
      case isGroupName:
        console.log(p.name);
        currentGroupName = toPascalCase(
          p.name.replace(/[^a-zA-Z0-9]/g, "").replace("FR", "")
        );
        data[currentGroupName] = {
          title: currentGroupName,
          items: [],
        };
        break;
      case isSportChannel:
        data[SPORT_GROUP_NAME].items = [...data[SPORT_GROUP_NAME].items, p];
        break;
      default:
        data[currentGroupName].items = [...data[currentGroupName].items, p];
        break;
    }
  });

  return data;
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
