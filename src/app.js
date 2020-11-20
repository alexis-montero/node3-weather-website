const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000;

//define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Alexis Montero",
  });
});
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Alexis Montero",
  });
});
app.get("/help", (req, res) => {
  res.render("help", {
    title: "HELP!!",
    paragraph: "I NEED HELP!",
    name: "Alexis Montero",
  });
});
//app.com
//app.com/help
//app.com/about
// app.get("", (req, res) => {
//   res.send();
// });
// app.get("/help", (req, res) => {
//   //the res.send will send it to the page
//   //res to send something back
//   res.send([
//     {
//       name: "Alex",
//       age: 23,
//     },
//     {
//       name: "Sarah",
//     },
//   ]);
// });
// app.get("/about", (req, res) => {
//   res.send("<h1>About</h1>");
// });
app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address",
    });
  }
  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }
      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide search term",
    });
  }
  console.log(req.query);
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: 404,
    name: "Alexis Montero",
    errorMessage: "Health article not found",
  });
});
app.get("*", (req, res) => {
  res.render("404", {
    title: 404,
    name: "Alexis Montero",
    errorMessage: "Page not found",
  });
});
//start the server up
//3000 common development port
//port 3000 when running locally
app.listen(port, () => {
  console.log("Server is up on port " + port);
});
