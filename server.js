const express = require("express");
const app = express();
const {PORT} = require("./config");

app.use(express.static('public'));

app.listen(port = PORT, () => {
  console.log(`Your app is listening on port ${port}`);
})

