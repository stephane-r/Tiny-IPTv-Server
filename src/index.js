const path = require("path");
const fs = require("fs");
const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const { v4: uuidv4 } = require("uuid");
const { getData } = require("./utils/data");
const download = require("download");
const makeId = require("./utils/makeId");

const app = new Koa();
const router = new Router();

router.post("/login", async (ctx) => {
  const serverUrl = ctx.request.body.url;
  const url = new URL(serverUrl);
  const username = url.searchParams.get("username");
  const id = makeId(6);
  const playlistId = `${username}-${id}`;

  try {
    fs.writeFileSync(
      path.resolve(`playlists/${playlistId}.m3u`),
      await download(serverUrl)
    );

    ctx.body = {
      playlistId,
    };
  } catch (error) {
    console.log(error);
    ctx.status = error.statusCode;
    ctx.body = { error: error.statusMessage };
  }
});

router.get("/playlist", (ctx) => {
  const { playlistId, country } = ctx.request.query;
  console.log(`${playlistId} request`);
  ctx.body = getData(playlistId, String(country).toUpperCase());
});

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
