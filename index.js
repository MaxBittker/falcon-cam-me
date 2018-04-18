"use strict";
const express = require("express");
const app = express();
app.use(express.static("out"));
app.listen(3001, () => console.log("Example app listening on port 3000!"));

const secrets = require("./secret.js");
const ts = require("tinyspeck");

let i = 0;

var slack = ts.instance({ token: secrets.token });

slack.on("/falcon", payload => {
  let user_id = payload.user_id;
  let response_url = payload.response_url;
  makeGif(url => {
    slack
      .send(response_url, {
        unfurl_links: true,
        text: "",
        response_type: "in_channel",
        attachments: [
          {
            title: "the birds",
            image_url: url,
            color: "#764FA5"
          }
        ]
      })
      .then(
        res => {
          // on success
          console.log("Response sent to /falcon slash command");
        },
        reason => {
          console.log("An error occurred:" + reason);
        }
      );
  });
});

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

  ls.stderr.on("data", data => {
    console.log(`stderr: ${data}`);
  });

  ls.on("close", code => {
    cb && cb(`http://159.203.112.6:3001/falcon${cI}.gif`);
  });
}
