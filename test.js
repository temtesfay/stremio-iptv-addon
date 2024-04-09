"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require('express');
// const https = require('https');
// const parser = require('iptv-playlist-parser');
// const axios = require('axios');
// const app = express();
// const port = 9000;
const playlist_1 = require("@iptv/playlist");
const m3u = `large.m3u8`;
const playlist = (0, playlist_1.parseM3U)(m3u);
const channels = playlist.channels;
// index.ts
console.log("Hello, TypeScript!");
console.log(channels)
