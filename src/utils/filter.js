const toPascalCase = require("./pascalCase");

const getPlaylistsByChannelQuality = (playlists) => {
  const DEFAULT_GROUP_NAME = "Divers";
  const SPORTS_GROUP_NAME = "Sports";
  const dataUpdated = {};
  const data = {};

  // First, we need to create all futur categories (qualities) by using group.title key
  // All group.title key will be added to data object (if not exist)
  playlists.map((p) => {
    const title = filterGroupName(p.group.title);

    if (data[title]) {
      data[title] = [...data[title], p];
    } else {
      data[title] = [p];
    }

    return p;
  });

  // After formated data with all categories
  // We can add for each quality, all channels by adding an Object with title (ex. Cinema) and items (channel list)
  Object.entries(data).forEach(([quality, items]) => {
    let currentGroupName = DEFAULT_GROUP_NAME;
    const groupQuality = [
      {
        title: DEFAULT_GROUP_NAME,
        items: [],
      },
    ];

    const generateGroup = (groupTitle, item) => {
      const group = groupQuality.find(
        (g) => g.title === groupTitle
      );
    
      if (group) {
        group.items.push({
          ...item,
          name: filterChannelName(item.name)
        })
      } else {
        groupQuality.push({
          title: groupTitle,
          items: [],
        });
      }
    }

    // We find every group name, first with string ▀▄, and every big Sports (ex. Canal+, etc)
    items.map((item) => {
      const isGroupName = item.name.includes("▀▄");
      const isSportGroup = quality === SPORTS_GROUP_NAME;
      const isCanalChannel = isSportGroup && item.name.includes('CANAL+');
      const isTeleFootChannel = isSportGroup && item.name.includes('TELEFOOT');
      const isRmcChannel = isSportGroup && item.name.includes('RMC SPORT');
      const isBeInSportChannel = isSportGroup && item.name.includes('IN SPORTS');
      const isEuroSportChannel = isSportGroup && item.name.includes('EUROSPORT');
      
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
        case isCanalChannel:
          generateGroup('Canal +', item);
          break;
        case isTeleFootChannel:
          generateGroup('Téléfoot', item);
          break;
        case isRmcChannel:
          generateGroup('RMC Sport', item);
          break;
        case isBeInSportChannel:
          generateGroup('BeInSport', item);
          break;
        case isEuroSportChannel:
          generateGroup('EuroSport', item);
          break;
        default:
          const groupName = groupQuality.find(
            (g) => g.title === currentGroupName
          );
          groupName.items.push({
            ...item,
            name: filterChannelName(item.name)
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

const filterGroupName = (name) =>
  name
    .replace('FR ', '')
    .replace('TV ', '')
    .replace(' (France)', '')
    .replace(' (FRANCE)', '')
    .replace(' (SECOURS)', '')
    .replace(' ( DOLBY DIGITAL)', '')
    .replace(' (DOLBY DIGITAL)', '')
    .replace(' ( France )', '')
    .replace(' FHD', '');

const filterChannelName = (name) => 
  name
    .replace('|FR| ', '')
    .replace('|FR|  ', '')
    // .replace('SD', '')
    // .replace('HD', '')
    // .replace('HEVC', '')
    // .replace('FHD', '')
    .replace('BKP', '')
    .replace(' F DOLBY DIGITAL', '');

module.exports = {
  getPlaylistsByChannelQuality,
  getPlaylistsByChannelGroup,
};
