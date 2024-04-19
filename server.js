// const express = require('express');
// // const https = require('https');
// // const parser = require('iptv-playlist-parser');
// // const axios = require('axios');
// const app = express();
// const port = 9000;


// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}/`);
// });

const { serveHTTP } = require("stremio-addon-sdk");
const addonInterface = require("./addon");
serveHTTP(addonInterface, { port: 3000 });
