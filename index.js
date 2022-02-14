const express = require("express");
const app = express();
const port = process.env.PORT || 9000;
const path = require("path");

app.use(express.static(__dirname + "/pub"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/pub/example.html"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
