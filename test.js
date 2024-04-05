const { exec } = require('child_process');

const inputFilePath = 'http://zaktv.city:80/series/temtesfay1055/telegram4321/2198503.mkv';
const outputFilePath = '/';

const command = `ffmpeg -i ${inputFilePath} -codec copy ${outputFilePath}`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
