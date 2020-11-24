const { parseM3uFile } = require("./parse");
const fs = require("fs");
const path = require("path");

const getCategories = (data) => {
  const categories = [];

  for (const [key] of Object.entries(data)) {
    categories.push(key);
  }

  return categories;
};

const filterDataByCountry = (data, country) =>
  data.filter((p) => p.group.title.includes(`${country} `));

// const saveData = (data, filename) =>
//   fs.writeFile(
//     path.resolve(`${filename}.json`),
//     JSON.stringify(data),
//     "utf8",
//     (error) => {
//       if (error) {
//         return console.log(error);
//       }

//       return console.log("Saved with success");
//     }
//   );

const parseData = (playlistId, country) => {
  const fileData = parseM3uFile(path.resolve(`playlists/${playlistId}.m3u`));
  const playlists = filterDataByCountry(fileData, country);
  const data = {};

  playlists.map((p) => {
    if (data[p.group.title]) {
      data[p.group.title] = [...data[p.group.title], p];
    } else {
      data[p.group.title] = [p];
    }

    return p;
  });

  // saveData(data, country);

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
