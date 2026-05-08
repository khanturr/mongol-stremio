const ADDON_ID_PREFIX = "mgl:";

function normalizeQuery(value) {
  return String(value || "").trim().toLowerCase();
}

function getChannelId(channel) {
  return `${ADDON_ID_PREFIX}${channel.id}`;
}

function getStreamId(id) {
  return String(id || "").startsWith(ADDON_ID_PREFIX)
    ? String(id).slice(ADDON_ID_PREFIX.length)
    : String(id || "");
}

function toMetaPreview(channel) {
  return {
    id: getChannelId(channel),
    type: "tv",
    name: channel.name,
    poster: channel.poster,
    posterShape: "square",
    genres: channel.genres || [],
    description: channel.description,
    releaseInfo: "Live"
  };
}

function toMeta(channel) {
  return {
    ...toMetaPreview(channel),
    background: channel.background || channel.poster,
    logo: channel.logo || channel.poster,
    language: channel.language,
    country: channel.country,
    website: channel.website,
    behaviorHints: {
      defaultVideoId: getChannelId(channel)
    }
  };
}

function findChannel(channels, stremioId) {
  const channelId = getStreamId(stremioId);
  return channels.find((channel) => channel.id === channelId);
}

function filterChannels(channels, extra = {}) {
  const search = normalizeQuery(extra.search);
  const genre = normalizeQuery(extra.genre);

  return channels.filter((channel) => {
    const matchesSearch =
      !search ||
      [channel.name, channel.description, channel.language, channel.country]
        .filter(Boolean)
        .some((value) => normalizeQuery(value).includes(search));

    const matchesGenre =
      !genre ||
      (channel.genres || []).some((value) => normalizeQuery(value) === genre);

    return matchesSearch && matchesGenre;
  });
}

function getCatalog(channels, extra = {}) {
  return filterChannels(channels, extra).map(toMetaPreview);
}

function getStreams(channel) {
  if (!channel) {
    return [];
  }

  return (channel.streams || []).map((stream) => ({
    name: stream.name || channel.name,
    title: stream.title || channel.name,
    url: stream.url,
    behaviorHints: {
      notWebReady: true,
      bingeGroup: `mgl-tv-${channel.id}`
    }
  }));
}

function getGenres(channels) {
  return [...new Set(channels.flatMap((channel) => channel.genres || []))].sort();
}

module.exports = {
  ADDON_ID_PREFIX,
  findChannel,
  getCatalog,
  getGenres,
  getStreams,
  toMeta
};
