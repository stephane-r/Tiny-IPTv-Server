const toPascalCase = require("./pascalCase");

const getPlaylistsByChannelQuality = (playlists) => {
  const DEFAULT_GROUP_NAME = "Default";
  const dataUpdated = {};
  const data = {};

  playlists.map((p) => {
    if (data[p.group.title]) {
      data[p.group.title] = [...data[p.group.title], p];
    } else {
      data[p.group.title] = [p];
    }

    return p;
  });

  console.log(Object.entries(data));

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
          currentGroupName = item.name;
          groupQuality.push({
            title: currentGroupName,
            items: [],
          });
          break;
        default:
          const groupName = groupQuality.find(
            (g) => g.title === currentGroupName
          );
          groupName.items.push(item);
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

module.exports = {
  getPlaylistsByChannelQuality,
  getPlaylistsByChannelGroup,
};
