// const express = require('express');
// const https = require('https');
// const parser = require('iptv-playlist-parser');
// const axios = require('axios');
// const app = express();
// const port = 9000;
// import { parseM3U, writeM3U } from "@iptv/playlist";
const {parseM3u,writeM3U} = require('@iptv/playlist');

const m3u = `#EXTM3U
#EXTINF:-1 tvg-id="Channel1" tvg-name="Channel 1" tvg-language="English" group-title="News",Channel 1
http://server:port/channel1`; // M3U file contents
const playlist: M3uPlaylist = parseM3U(m3u);
const channels: M3uChannel[] = playlist.channels;

console.log(playlist)


// index.ts
console.log("Hello, TypeScript!");
