const express = require("express");
const path = require("path");
const app = express();
const {PORT} = require("./config");

app.use(express.static('public'));

app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'public', 'landing-page.html'));
})

app.get("/dashboard", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'public', 'dashboard.html'));
})

app.get("/new-trip", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'public', 'new-trip.html'));
})


app.listen(port = PORT, () => {
  console.log(`Your app is listening on port ${port}`);
})

module.exports = app;