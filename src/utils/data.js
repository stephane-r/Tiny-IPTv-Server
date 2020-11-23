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

const filterDataByCountry = (country, data = parseM3uFile()) =>
  data.filter((p) => p.group.title.includes(`${country} `));

const saveData = (data, filename) =>
  fs.writeFile(
    path.resolve(`${filename}.json`),
    JSON.stringify(data),
    "utf8",
    (error) => {
      if (error) {
        return console.log(error);
      }

      return console.log("Saved with success");
    }
  );

const parseData = (country) => {
  const playlists = filterDataByCountry(country);
  const data = {};

  playlists.map((p) => {
    if (data[p.group.title]) {
      data[p.group.title] = [...data[p.group.title], p];
    } else {
      data[p.group.title] = [p];
    }

    return p;
  });

  saveData(data, country);

  return data;
};

module.exports = {
  getCategories,
  filterDataByCountry,
  parseData,
};
