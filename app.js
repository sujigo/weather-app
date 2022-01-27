// Ceate Weather App given 3 free openweathermap.org APIs. 

const cityName = document.querySelector("#current-main-cityName");
const cityTemp = document.querySelector("#current-main-temp");
const cityDesc = document.querySelector("#current-main-desc");
const cityIcon = document.querySelector("#current-main-icon");
const sunrise = document.querySelector("#sunrise");
const sunset = document.querySelector("#sunset");
const feelslike = document.querySelector("#feelslike");
const humidity = document.querySelector("#humidity");
const pressure = document.querySelector("#pressure");
const wind = document.querySelector("#wind");
const visibility = document.querySelector("#visibility");
const pcpn = document.querySelector("#pcpn");
const hourly = document.querySelector("#hourly");
const searchButton = document.querySelector("#searchButton");
const listGroup = document.querySelector(".list-group");
const addButton = document.querySelector("#addButton");
const cityInput = document.querySelector('input');


/// Current Weather Data API
async function getCurrentWeather(city="minneapolis") {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ce3b40ed8bc31d2e7a9c3e64ef5de26d&units=metric`);
        if (response.ok) {
            const jsonRes = await response.json();
            console.log(jsonRes);

            // main weather
            cityName.textContent = jsonRes.name;
            cityTemp.textContent = Math.round(jsonRes.main.temp) + "°";
            cityIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${jsonRes.weather[0].icon}@2x.png"/>`
            cityDesc.textContent = jsonRes.weather[0].main;

            // extra
            sunrise.textContent = unixTimeConvertHourSec(jsonRes.sys.sunrise);
            sunset.textContent = unixTimeConvertHourSec(jsonRes.sys.sunset);
            feelslike.textContent = jsonRes.main.feels_like + "°";
            humidity.textContent = jsonRes.main.humidity + "%";
            pressure.textContent = (jsonRes.main.pressure / 33.86).toFixed(2) + "inHg";
            wind.textContent = jsonRes.wind.speed + "m/s";
            visibility.textContent = (jsonRes.visibility * 0.00062137).toFixed(1) + "mi";
            jsonRes.precipitation ? pcpn.textContent = jsonRes.precipitation : pcpn.textContent = "0\"";

            displayCityList();

        }
    } catch (err) {
        console.log(err);
    };
};
getCurrentWeather();


/// 3 Hour Forecast
async function getHoursWeather(city="minneapolis"){
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=ce3b40ed8bc31d2e7a9c3e64ef5de26d&units=metric`);
        if (response.ok) {
            const jsonRes = await response.json();
            console.log(jsonRes);

            // Remove previous divs
            while (hourly.firstChild) {
                hourly.removeChild(hourly.firstChild);
            };
            
            for (let i=0; i<16; i++) {
                const eachDay = jsonRes.list[i];
                const dt = eachDay.dt;
                const icon = eachDay.weather[0].icon;
                const imageUrl = `http://openweathermap.org/img/wn/${icon}.png`;
                const temp = Math.round(eachDay.main.temp);

                const newDivHours = document.createElement("div");
                newDivHours.innerHTML = `
                    <h6>${unixTimeConvertSec(dt)}</h6>
                    <img src="${imageUrl}"/>
                    <h6>${temp}</h6>
                `;
                hourly.appendChild(newDivHours);             
            }          
        }
        
    } catch (err) {
        console.log(err);
    };
};
getHoursWeather();


searchButton.addEventListener("click", function() {
    const cityInputValue = document.querySelector('input').value;
    if(cityInputValue) {
        getCurrentWeather(cityInputValue);
        getHoursWeather(cityInputValue);
    };
    cityInput.value = "";
});

cityInput.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
    //   event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("searchButton").click();
    }
});



const displayCityList = function() {
    while (listGroup.firstChild) {
        listGroup.removeChild(listGroup.firstChild);
    };

    for (let i=0; i<localStorage.length; i++){
        const newCityList = document.createElement("li");
        newCityList.classList.add ("list-group-item", "py-1", "px-1", "mr-1", "d-flex", "savedList");
        const savedCityName = localStorage.getItem(localStorage.key(i));
        newCityList.innerHTML = `
            ${savedCityName}
            <i class="fas fa-times" onclick="removeSavedCity('${savedCityName}')"></i>
        `;
        listGroup.appendChild(newCityList); 
    };
    
    const savedList = document.querySelector(".list-group").children;
    nevigateCityList(savedList);
};


const nevigateCityList = function(savedList) {
    for (let i=0; i<savedList.length; i++) {
        savedList[i].addEventListener("click", function() {
            console.log(savedList[i].innerHTML);
            console.log(savedList[i].textContent);
            getCurrentWeather(savedList[i].textContent);
            getHoursWeather(savedList[i].textContent);
        })   
    };
};

// DELETE COTY LIST
const removeSavedCity = function(city){
    localStorage.removeItem(city);
};


addButton.addEventListener("click", function() {
    console.log(cityName.textContent)
    if (!localStorage.getItem(cityName.textContent)) localStorage.setItem(cityName.textContent, cityName.textContent);
    displayCityList();
});




/// Weather Maps



/// Time converter. Make this as module.
const unixTimeConvertSec = function(unix) {
    const unixConverted = new Date(unix * 1000);
    let hours = unixConverted.getHours();
    // let minutes = unixConverted.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    // minutes = minutes.toString().padStart(2, '0');
    let strTime = hours + ampm;
    return strTime;
}

const unixTimeConvertHourSec = function(unix) {
    const unixConverted = new Date(unix * 1000);
    let hours = unixConverted.getHours();
    let minutes = unixConverted.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes.toString().padStart(2, '0');
    let strTime = hours + ':' + minutes + ampm;
    return strTime;
}

const getDay = function(unix) {
    const unixConverted = new Date(unix * 1000);
    const options = {
    weekday: "long"
    };

    return unixConverted.toLocaleDateString("en-US", options);
}
