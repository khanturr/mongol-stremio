const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const channels = require("../channels.json");
const {
  ADDON_ID_PREFIX,
  findChannel,
  getCatalog,
  getGenres,
  getStreams,
  toMeta
} = require("./catalog");

const PORT = Number(process.env.PORT || 7000);

const manifest = {
  id: "community.mongolian-tv",
  version: "0.1.0",
  name: "Mongolian TV",
  description: "Live Mongolian TV channels for Stremio.",
  resources: [
    "catalog",
    { name: "meta", types: ["tv"], idPrefixes: [ADDON_ID_PREFIX] },
    { name: "stream", types: ["tv"], idPrefixes: [ADDON_ID_PREFIX] }
  ],
  types: ["tv"],
  catalogs: [
    {
      type: "tv",
      id: "mongolian-tv",
      name: "Mongolian TV",
      extra: [
        { name: "search", isRequired: false },
        { name: "genre", isRequired: false, options: getGenres(channels) }
      ]
    }
  ],
  idPrefixes: [ADDON_ID_PREFIX],
  behaviorHints: {
    configurable: false,
    adult: false,
    p2p: false
  }
};

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(({ type, id, extra }) => {
  if (type !== "tv" || id !== "mongolian-tv") {
    return Promise.resolve({ metas: [] });
  }

  return Promise.resolve({ metas: getCatalog(channels, extra) });
});

builder.defineMetaHandler(({ type, id }) => {
  if (type !== "tv") {
    return Promise.resolve({ meta: null });
  }

  const channel = findChannel(channels, id);
  return Promise.resolve({ meta: channel ? toMeta(channel) : null });
});

builder.defineStreamHandler(({ type, id }) => {
  if (type !== "tv") {
    return Promise.resolve({ streams: [] });
  }

  return Promise.resolve({ streams: getStreams(findChannel(channels, id)) });
});

serveHTTP(builder.getInterface(), {
  port: PORT,
  cacheMaxAge: 60 * 5
});
