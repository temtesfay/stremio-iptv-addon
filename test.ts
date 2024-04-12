// const express = require('express');
// const https = require('https');
// const parser = require('iptv-playlist-parser');
// const axios = require('axios');
// const app = express();
// const port = 9000;
// import { parseM3U, writeM3U } from "@iptv/playlist";
const {parseM3u,writeM3U} = require('@iptv/playlist');

const m3u = `https://zaktv.city/get.php?username=temtesfay1055&password=telegram4321&type=m3u_plus&output=ts`; // M3U file contents
const playlist: M3uPlaylist = parseM3U(m3u);
const channels: M3uChannel[] = playlist.channels;

console.log(playlist)


// index.ts
console.log("Hello, TypeScript!");
