const { parseM3uFile } = require("./parse");
// const fs = require("fs");
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

  return getPlaylistsByQualityGroup(data);
};

//
// GET PLAYLISTS BY QUALITY AND BY GROUP
//
// Current DATA structure :
// {
//   [qualityName]: [],
//   [qualityName]: []
// }

// Wanted DATA structure :
// {
//   [qualityName]: [
//     {
//       title: [groupName],
//       items: [
//         {
//           ...
//         },
//         ...
//       ]
//     }
//   ]
// }

const getPlaylistsByQualityGroup = (data) => {
  const DEFAULT_GROUP_NAME = "Default";
  const dataUpdated = {};

  Object.entries(data).forEach(([quality, items]) => {
    let currentGroupName = DEFAULT_GROUP_NAME;
    const groupQuality = [
      {
        title: DEFAULT_GROUP_NAME,
        items: [],
      },
    ];

    items.map((item) => {
      const isGroupName = item.name.includes("▀▄");

      if (isGroupName) {
        currentGroupName = item.name;

        groupQuality.push({
          title: currentGroupName,
          items: [],
        });
      } else {
        const groupName = groupQuality.find(
          (g) => g.title === currentGroupName
        );
        groupName.items.push(item);
        groupQuality[currentGroupName] = groupName;
      }
    });

    dataUpdated[quality] = groupQuality;
  });

  return dataUpdated;
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
