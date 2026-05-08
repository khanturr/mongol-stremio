const assert = require("node:assert/strict");
const channels = require("../channels.json");
const {
  ADDON_ID_PREFIX,
  findChannel,
  getCatalog,
  getGenres,
  getStreams,
  toMeta
} = require("../src/catalog");

const catalog = getCatalog(channels);
assert.equal(catalog.length, channels.length);
assert.ok(catalog.every((item) => item.type === "tv"));
assert.ok(catalog.every((item) => item.id.startsWith(ADDON_ID_PREFIX)));

const sportResults = getCatalog(channels, { search: "sport" });
assert.equal(sportResults.length, 1);
assert.equal(sportResults[0].name, "MNB Sport");

const newsResults = getCatalog(channels, { genre: "News" });
assert.ok(newsResults.some((item) => item.name === "MNB"));

const channel = findChannel(channels, "mgl:mnb-world");
assert.equal(channel.name, "MNB World");

const meta = toMeta(channel);
assert.equal(meta.behaviorHints.defaultVideoId, "mgl:mnb-world");

const streams = getStreams(channel);
assert.equal(streams.length, 1);
assert.equal(streams[0].behaviorHints.notWebReady, true);

console.log("catalog tests passed");
