const toPascalCase = require("./pascalCase");

const getPlaylistsByChannelQuality = (playlists) => {
  const DEFAULT_GROUP_NAME = "Default";
  const dataUpdated = {};
  const data = {};

  playlists.map((p) => {
    const title = p.group.title
      .replace('FR ', '')
      .replace('TV ', '')
      .replace(' (France)', '')
      .replace(' (FRANCE)', '')
      .replace(' (SECOURS)', '')
      .replace(' ( DOLBY DIGITAL)', '')
      .replace(' (DOLBY DIGITAL)', '')
      .replace(' ( France )', '')
      .replace(' FHD', '');

    if (data[title]) {
      data[title] = [...data[title], p];
    } else {
      data[title] = [p];
    }

    return p;
  });

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

      switch (true) {
        case isGroupName:
          currentGroupName = toPascalCase(
            item.name.replace(/[^a-zA-Z0-9]/g, "").replace("FR", "")
          );
          groupQuality.push({
            title: currentGroupName,
            items: [],
          });
          break;
        default:
          const groupName = groupQuality.find(
            (g) => g.title === currentGroupName
          );
          groupName.items.push({
            ...item,
            name: item.name
              .replace('|FR| ', '')
              // .replace('SD', '')
              // .replace('HD', '')
              // .replace('HEVC', '')
              // .replace('FHD', '')
              .replace('BKP', '')
              .replace(' F DOLBY DIGITAL', '')
          });
          groupQuality[currentGroupName] = groupName;
          break;
      }
    });

    dataUpdated[quality] = groupQuality;
  });

  return dataUpdated;
};

const getPlaylistsByChannelGroup = (playlists) => {
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

module.exports = {
  getPlaylistsByChannelQuality,
  getPlaylistsByChannelGroup,
};
