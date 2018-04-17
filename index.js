"use strict";
const express = require("express");
const app = express();

const ts = require("tinyspeck");
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(3001, () => console.log("Example app listening on port 3000!"));
app.use(express.static("out"));
("use strict");

let i = 0;

var slack = ts.instance({});
var connected = false;

slack.on("/falcon", payload => {
  let user_id = payload.user_id;
  let response_url = payload.response_url;
  makeGif(url => {
    slack.send(response_url, url).then(
      res => {
        // on success
        console.log("Response sent to /falcon slash command");
      },
      reason => {
        console.log(
          "An error occurred when responding to /count slash command: " + reason
        );
      }
    );
  });
});

function getConnected() {
  return new Promise(function(resolving) {
    if (!connected) {
      connected = datastore.connect().then(function() {
        resolving();
      });
    } else {
      resolving();
    }
  });
}

// incoming http requests
slack.listen("3000");

function makeGif(cb) {
  let cI = i++;
  const { spawn } = require("child_process"),
    ls = spawn("ffmpeg", [
      "-i",
      "https://videos3.earthcam.com/fecnetwork/10201.flv/chunklist_w1854970974.m3u8",
      "-c:v",
      "gif",
      "-t",
      "5",
      `out/falcon${cI}.gif`
    ]);
  ls.stdout.on("data", data => {
    // console.log(`stdout: ${data}`);
  });

  ls.stderr.on("data", data => {
    console.log(`stderr: ${data}`);
  });

  ls.on("close", code => {
    cb && cb(`http://159.203.112.6:3000/falcon${cI}.gif`);
  });
}

// makeGif();
