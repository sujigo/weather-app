const express = require("express");
const https = require("https"); // we dont't need to inatall using node (like app=express()) becuae it is original node module 
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");

})

app.post("/", function(req,res){
    console.log(req.body.cityName);
    /// const url = "https://api.openweathermap.org/data/2.5/weather?q=minneapolis&appid=ce3b40ed8bc31d2e7a9c3e64ef5de26d&units=metric"

    // const query = "Minneapolis";
    // const appid = "ce3b40ed8bc31d2e7a9c3e64ef5de26d";
    // const units = "metric"
    const query = req.body.cityName;
    const appid = "ce3b40ed8bc31d2e7a9c3e64ef5de26d";
    const units = "metric"
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${appid}&units=${units}&cnt=1`;

    https.get(url, function(response){
        console.log(response.statusCode);

        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
            // res.send("The temparatue in minneapolis is " + temp + " degree Celcius")
            // res.send("<p>The weather is currently ${description}</p>")
            res.write(`<p>The weather is currently ${description}</p>`);
            res.write(`<h1>The temparatue in ${query} is ${temp} degree Celcius</h1>`);
            res.write(`<img src="${imageUrl}"/>`)
            res.send(); //usging res.write because cannot use more than 1 res.send
    
        })
    })
})

    



app.listen(3000, function() {
    console.log("Server is running on port 3000");
})