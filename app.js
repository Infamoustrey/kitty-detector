const express = require("express");
const axios = require("axios");

const app = express();

app.get("/api/cat", (req, res) => {
  axios.get("https://api.thecatapi.com/v1/images/search").then(response1 => {
    let cat = response1.data[0];

    const { width, height, url } = cat;

    axios
      .get(url, {
        responseType: "arraybuffer"
      })
      .then(response => {
        const base64 =
          "data:" +
          response.headers["content-type"] +
          ";base64," +
          Buffer.from(response.data, "binary").toString("base64");

        res.send({ width, height, base64 });
      });
  });
});

app.use(express.static("public"));

app.listen(3000, () => console.log("server running"));
