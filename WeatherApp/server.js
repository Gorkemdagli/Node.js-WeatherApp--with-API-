const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();

const dotenv = require('dotenv').config();
const apiKey = process.env.API_KEY;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("index", { weather: null, error: null });
});

app.post("/", function(req, res) {
    let city = req.body.city;

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    
    request(url, function(err, response, body) {
        if (err) {
            res.render("index", { weather: null, error: "Error, Please try again!" });
        } else {
            let weatherData = JSON.parse(body);
            res.render("index", { 
                weather: weatherData, 
                error: null,
                place: weatherData.name,
                timezone: weatherData.timezone,
                temp: weatherData.main.temp,
                fahrenheit: ((weatherData.main.temp * 9/5) + 32).toFixed(2),
                main: weatherData.weather[0].main,
                description: weatherData.weather[0].description,
                clouds: weatherData.clouds.all,
                visibility: weatherData.visibility,
                humidity: weatherData.main.humidity,
                pressure: weatherData.main.pressure
            });
        }
    });
});

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});
