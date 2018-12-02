const express = require("express");
const { json } = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const massive = require("massive");

const port = 3001;

const app = express();
app.use(json());
app.use(cors());

massive(process.env.CONNECTION_STRING)
  .then(db => app.set("db", db))
  .catch(console.log);

const addNote = (req, res) => {
  console.log(req);
  console.log("HIT");
  req.app
    .get("db")
    .addNote([req.body.description])
    .then(response => res.status(200).json(response))
    .catch(err => res.status(500).json(err));
};
const getAllNotes = (req, res) => {
  console.log(req.user);
  console.log("HIT");
  req.app
    .get("db")
    .getAllNotes()
    .then(response => res.status(200).json(response))
    .catch(err => res.status(500).json(err));
};

app.post("/dialogFlow", function(req, res) {
  console.log("REQUEST COMES IN", req.body.queryResult.parameters);
  let obj = req.body.queryResult.parameters;
  if (Object.keys(obj)[0] === "geo-city") {
    let city = req.body.queryResult.parameters["geo-city"];
    let temperature = "";
    let dialogResponse = " ";

    axios
      .get(process.env.WEATHER_API)

      .then(response => {
        temperature = response.data.main.temp;
        console.log("Temperature before", temperature);

        dialogResponse = `The temperature in ${city} is ${temperature} farenheits. Is there anything else I may help you with?`;
        console.log("Dialog response before", dialogResponse);
        let responseObj = { fulfillmentText: dialogResponse };
        return res.send(JSON.stringify(responseObj));
      });
  } else if (Object.keys(obj)[0] === "joke") {
    axios.get(`http://api.icndb.com/jokes/random`).then(response => {
      let responseObj = { fulfillmentText: response.data.value.joke };
      return res.send(JSON.stringify(responseObj));
    });
  } else if (Object.keys(obj)[0] === "note") {
    console.log("That was a NOTE Request", req.body.queryResult.queryText);
    let noteDetails = req.body.queryResult.queryText.split("note ")[1];
    noteDetails = noteDetails.charAt(0).toUpperCase() + noteDetails.slice(1);
    console.log("NOTE DETAiLS", noteDetails);
    axios
      .post(`http://165.227.30.20/api/addNote`, { description: noteDetails })
      .then(response => {
        dialogResponse = `Thank you, your note "${noteDetails}" was added.`;
        console.log(response);
        let responseObj = { fulfillmentText: dialogResponse };
        return res.send(JSON.stringify(responseObj));
      });
  }
});

app.post("/api/addNote", addNote);
app.get("/api/getNotes", getAllNotes);

app.post("/jokeBot", function(req, res) {
  let joke = req.body.queryResult.parameters["joke"];

  axios.get(`http://api.icndb.com/jokes/random`).then(response => {
    let responseObj = { fulfillmentText: response.data.value.joke };
    return res.send(JSON.stringify(responseObj));
  });
});

app.listen(port, () => {
  console.log(`Listening on port: port`);
});
