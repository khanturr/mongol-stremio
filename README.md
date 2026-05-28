# Mongolian TV Stremio Addon

A small Stremio addon that exposes Mongolian live TV channels as a `tv` catalog.

The bundled starter list uses publicly documented Mongolian channel live streams. Add more channels by editing `channels.json` with streams.

## Setup

```bash
npm install
npm start
```

By default the addon runs on port `7000`. You can change it with:

```bash
PORT=8080 npm start
```

After the server starts, install it in Stremio from:

```text
http://127.0.0.1:7000/manifest.json
```

## Test

```bash
npm test
```

## Deploy on Render

1. Push this project to a GitHub repository.
2. In Render, create a new Blueprint or Web Service from that repository.
3. If Render does not auto-detect `render.yaml`, use these settings:

```text
Runtime: Node
Build Command: npm install
Start Command: npm start
```

Render provides the `PORT` environment variable automatically, and the addon already uses it.

After deploy, install the addon in Stremio from:

```text
https://your-render-service.onrender.com/manifest.json
```

## Add Channels

Each `channels.json` entry looks like this:

```json
{
  "id": "example-channel",
  "name": "Example Channel",
  "description": "Short channel description.",
  "genres": ["General"],
  "language": "Mongolian",
  "country": "Mongolia",
  "website": "https://example.com/live",
  "poster": "https://example.com/logo.png",
  "streams": [
    {
      "name": "Live",
      "url": "https://example.com/live/playlist.m3u8"
    }
  ]
}
```

Use stable IDs with lowercase letters, numbers, and hyphens. The addon turns them into Stremio IDs like `mgl:example-channel`.

## Notes

Stremio's Addon SDK manifest defines which resources an addon provides, including `catalog`, `meta`, and `stream`. This addon provides a TV catalog, details pages for channels, and live stream URLs for each selected channel.
