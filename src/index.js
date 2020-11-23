const Koa = require("koa");
const app = new Koa();
const { getCategories, parseData } = require("./utils/data");
// const { isCacheFileExist, getCacheFileData } = require("./utils/file");

const getData = (country) => {
  // if (isCacheFileExist(country)) {
  //   console.log("Cache file exist, load data from file");
  //   return getCacheFileData(country);
  // }

  const data = parseData(country);

  if (!data) {
    return {
      categories: [],
      data: [],
    };
  }

  return {
    categories: getCategories(data),
    data,
  };
};

app.use((ctx) => {
  ctx.body = getData(String(ctx.request.query.country).toUpperCase());
});

app.listen(3000);
