const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const currentCard = document.getElementById('currentCard');
const secondCard = document.getElementById('secondCard');
const thirdCard = document.getElementById('thirdCard');
const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

searchBtn.onclick = () => {
  let city = cityInput.value.trim();
  if (city) getWeather(city);
  else if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(p =>
      getWeather(`${p.coords.latitude},${p.coords.longitude}`)
    );
  }
};

async function getWeather(city) {
  try {
    let apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=c49b0f7ea9d049c9ac4224238251809&q=${city}&days=3`;
    let proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;
    let res = await fetch(proxyUrl);
    let data = await res.json();
    showWeather(data);
    localStorage.setItem("lastWeather", JSON.stringify(data));
  } catch {
    currentCard.innerHTML = "<p> Error fetching weather</p>";
  }
}

function showWeather(data) {
  let d = new Date(),
    today = days[d.getDay()],
    date = `${d.getDate()} ${months[d.getMonth()]}`;

let cartona=''
cartona=`
<header class="d-flex justify-content-between p-2"> 
    <h1 id="currentDay">${today}</h1> <h1 id="currentDate">${date}</h1>
</header>
    <div class="content p-3">
      
    <h1 id="cityName"> ${data.location.name}</h1>
    <div class="degree text-white">
      <div id="currentNum">${data.current.temp_c}°C</div>
    <div class="forcast-icon">
      <img src="${"https:" + data.current.condition.icon}" class="forcast-img" id="forecast-condition-icon" alt="">
    </div>
    </div>
  
    <div id="custom1" class="text-info">${data.current.condition.text}</div><br>
    <span class="p-3"><img src="./images/icon-umberella.png" class="gray-icon" alt=""> 20%</span>
    <span class="p-3"><img src="./images/icon-wind.png" class="gray-icon" alt=""> 18km/h</span>
    <span class="p-3"><img src="./images/icon-compass.png" class="gray-icon" alt=""> East</span>

    </div>`

document.getElementById('currentCard').innerHTML=cartona;

  [secondCard, thirdCard].forEach((card, i) => {
    let day = data.forecast.forecastday[i+1];
    card.innerHTML = day ?`
<header class=" p-2 text-center"> 
      <h1 id="day2" >${days[(d.getDay()+i+1)%7]}</h1> 
</header>
    <div class="content p-3  ">
    <div class="forcast-icon  w-100 d-flex justify-content-center align-items-center "> <img src="${"https:" + day.day.condition.icon}" class="forcast-img" id="forecast-condition-icon"  alt=""> </div>
    <div class="forcast-degree text-white text-center">
      <h1 id="num2">${day.day.maxtemp_c}° </h1>
      <p class="second">${day.day.mintemp_c}°</p>
      <p id="forcast-custom" class="text-info">${day.day.condition.text}</p>
    </div>
    </div>
`: "";
  });
}

window.onload = () => {
  let last = localStorage.getItem("lastWeather");
  if (last) showWeather(JSON.parse(last));
};


