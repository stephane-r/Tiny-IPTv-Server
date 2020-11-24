const path = require("path");
const fs = require("fs");
const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const { v4: uuidv4 } = require("uuid");
const { getData } = require("./utils/data");
const download = require("download");

const app = new Koa();
const router = new Router();

router.post("/playlist", async (ctx) => {
  const playlistId = uuidv4();
  fs.writeFileSync(
    path.resolve(`playlists/${playlistId}.m3u`),
    await download(ctx.request.body.url)
  );

  ctx.body = {
    playlistId,
  };
});

router.get("/playlist", (ctx) => {
  const { playlistId, country } = ctx.request.query;
  ctx.body = getData(playlistId, String(country).toUpperCase());
});

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
