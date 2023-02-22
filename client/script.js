import bot from './assets/casi.svg';
import user from './assets/user.svg';



const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');
const timeElement = document.querySelector(".time");
const dateElement = document.querySelector(".date");
const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");

//------------------------------------------------------------ Google Search Button Module -------------------------------------------------------------//

const button = document.querySelector('form button[name = "GS"]');
button.addEventListener('click', function() {
  const input = document.querySelector('form input[name="q"]');
  const query = input.value;
  window.open(`https://www.google.com/search?q=${query}`, '_blank');
  input.value = "";
});


//------------------------------------------------------------ SPEECH SYNTH API MODULE Work better in CHROME-------------------------------------------------------------//

const synth = window.speechSynthesis;

// DOM Elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

//Browser identifier
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

// Init voices array
let voices = [];

const getVoices = () => 
{
  voices = synth.getVoices();

  // Loop through voices and create an option for each one
  voices.forEach(voice => 
  {
    // Create option element
    const option = document.createElement('option');
    // Fill option with voice and language
    option.textContent = voice.name + '(' + voice.lang + ')';

    // Set needed option attributes
    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);
    voiceSelect.appendChild(option);
  });
};

//Line 35, 36 causes voice list duplication
getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

// Speak
const speak = () => 
{
  // Check if speaking
  if (synth.speaking) {
    console.error('Already speaking...');
    return;
  }
  if (textInput.value !== '') 
  {
    // Add background animation
    // body.style.background = '#141414 url(assets/voicewave.gif)';
    // body.style.backgroundRepeat = 'repeat-x';
    // body.style.backgroundSize = '100% 100%';

    // Get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);

    // Speak end
    speakText.onend = e => {
      console.log('Done speaking...');
      body.style.background = '#141414';
    };

    // Speak error
    speakText.onerror = e => {
      console.error('Something went wrong');
    };
    // Selected voice
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
    'data-name'
    );
    
    // Loop through voices
    voices.forEach(voice => {
    if (voice.name === selectedVoice) {
    speakText.voice = voice;
    }
    });
    
    // Set pitch and rate
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;

    // Speak
    synth.speak(speakText);
  }
};

// EVENT LISTENERS

// Text form submit
//textForm.addEventListener('submit', e => {
//  e.preventDefault();
//  speak();
//  textInput.blur();
//});

// Rate value change
rate.addEventListener('change', e => (rateValue.textContent = rate.value));

// Pitch value change
pitch.addEventListener('change', e => (pitchValue.textContent = pitch.value));

// Voice select change
voiceSelect.addEventListener('change', e => speak());


//------------------------------------------------------------VOiCE RECOGNITION MODULE Work better in CHROME-------------------------------------------------------------//

const searchForm = document.querySelector("#search-form");
const searchFormInput = searchForm.querySelector("input");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;


if (SpeechRecognition) {
  console.log("Your browser supports speech recognition");

  // Create and append a new microphone button
  const micBtn = document.createElement("button");
  micBtn.type = "button";
  micBtn.innerHTML = '<img src="./assets/OFF_VR.png" /><img src="./assets/ON_VR.png" style="display: none" />';
  searchForm.appendChild(micBtn);

  // Get references to the two images
  const microphone = micBtn.querySelectorAll("img")[0];
  const microphoneSlash = micBtn.querySelectorAll("img")[1];

  // Create a new SpeechRecognition object
  const recordingrecognition = new SpeechRecognition();
  recordingrecognition.continuous = true; // <- it is for long hold to speak...........
  // recognition.lang="hi-IN"; // for HINDI Language result
  // recognition.lang="mr-IN"; // for MARATHI Language result

  // Add a click event listener to the microphone button
  micBtn.addEventListener("click", () => 
  {
    if (microphone.style.display === "")   // start speech recognition
    {
      recordingrecognition.start();
    }
     else         // stop speech recognition
    {
      recordingrecognition.stop();
    }
  });
  recordingrecognition.addEventListener("start",startSpeechRecognition);
  function startSpeechRecognition()
  {
    microphone.style.display = "none";
    microphoneSlash.style.display = "";
    searchFormInput.focus();
    console.log("Speech Recognition active");
  }
  recordingrecognition.addEventListener("end",endSpeechRecognition);
  function endSpeechRecognition()
  {
    microphone.style.display = "";
    microphoneSlash.style.display = "none";
    searchFormInput.focus();
    console.log("Speech Recognition Disconnected");
  }

  // handle the recording result from user by microphone
  recordingrecognition.addEventListener("result", resultofSpeechRecognition);
  function resultofSpeechRecognition(event)
  {
    const currentResultIndex = event.resultIndex;
    const transcript = event.results[currentResultIndex][0].transcript;

    // if(transcript.toLowerCase().trim() === "start recording")
    // {
    //   recordingrecognition.start();
    // }
    // else 
    if(transcript.toLowerCase().trim()==="stop recording")
    {
      recordingrecognition.stop();
      searchFormInput.value = "";
  
    }
    else if(!searchFormInput.value)
    {
      searchFormInput.value = transcript;
    }
    else
    {
    if(transcript.toLowerCase().trim()==="search")
    {
      searchForm.submit();
      searchFormInput.value = "";
    }
    else if (transcript.toLowerCase().trim() === "submit") 
    {
      let event = new Event('submit');
      handleSubmit(event);    
    }
    else if(transcript.toLowerCase().trim()==="reset input")
    {
      searchFormInput.value = "";
    }
    else{
      searchFormInput.value = transcript;
    }
    }
  }
} 
else 
{
  console.log("Your browser does not support speech recognition");
}


//-----------------------------------------------------------------date/time Clock function-----------------------------------------------------//

function formatTime(date) {
  const hours12 = date.getHours() % 12 || 12;
  const minutes = date.getMinutes();
  const isAm = date.getHours() < 12;

  return `${hours12.toString().padStart(2,"0")} : ${minutes.toString().padStart(2,"0")} ${isAm ? "AM" : "PM"}`;
}
function formatDate(date) {
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  return `${DAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
}
setInterval(() => {
  const now = new Date();

  timeElement.textContent = formatTime(now);
  dateElement.textContent = formatDate(now);
}, 200);


//------------------------------------------------------Geolocation service with Weather---------------------------------------------------------------//

// App data
const weather = {};

weather.temperature = {
    unit : "celsius"
}

// APP CONSTS AND VARS
const KELVIN = 273;                                                        
// API KEY
const key = "82005d27a116c2880c8f0fcb866998a0";                             //..........change API KEY.....//

// CHECK IF BROWSER SUPPORTS GEOLOCATION
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// SET USER'S POSITION
function setPosition(position){
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  
  getWeather(latitude, longitude);
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error){
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p>${error.message}</p>`;
  // tempElement.remove();
  // descElement.remove();
  // locationElement.remove();
  
}

// GET WEATHER FROM API PROVIDER
function getWeather(latitude, longitude){
  let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
  
  fetch(api)
      .then(function(response){
          let data = response.json();
          return data;
      })
      .then(function(data){
          weather.temperature.value = Math.floor(data.main.temp - KELVIN);
          weather.description = data.weather[0].description;
          weather.iconId = data.weather[0].icon;
          weather.city = data.name;
          weather.country = data.sys.country;
      })
      .then(function(){
          displayWeather();
      });
}

// DISPLAY WEATHER TO UI
function displayWeather()
{
  iconElement.innerHTML = `<img src="./weather-icons/${weather.iconId}.png"style="height: 50px; width: 50px">`;
  tempElement.innerHTML = `${weather.temperature.value}&#8451;`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`; 
}


// C to F conversion
function celsiusToFahrenheit(temperature){
  return (temperature * 9/5) + 32;
}


// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
tempElement.addEventListener("click", function(){
  if(weather.temperature.value === undefined) return;
  
  if(weather.temperature.unit == "celsius"){
      let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
      fahrenheit = Math.floor(fahrenheit);
      
      tempElement.innerHTML = `${fahrenheit}&#8457;`;
      weather.temperature.unit = "fahrenheit";
  }else{
      tempElement.innerHTML = `${weather.temperature.value}&#8451;`;
      weather.temperature.unit = "celsius";
  }
});

//-----------------------------------------------------------Chat Gpt-3 Loading Interval------------------------------------------------------------------//
  

let loadInterval;

  function loader(element) {           // loading dots interval  //
    element.textContent = '';

    loadInterval = setInterval(() => {
      element.textContent += '.';

      if (element.textContent === '....') {
        element.textContent = '';
      }
    }, 300)
  }

  function typeText(element, text) {        // bot's Typing text interval  //
    let index = 0;

    let interval = setInterval(() => {
      if (index < text.length) {
        element.innerHTML += text.charAt(index);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20)
  }

  function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
  }

  function chatStripe(isAi, value, uniqueId)        //  create chats stripes //
  {
    return (
      `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
          <img
          src="${isAi ? bot : user}"
          alt="${isAi ? 'bot' : 'user'}"
          />
          </div>
          <div class="message" id=${uniqueId}>${value}</div>
        </div>  
      </div>
    `
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData(form);
  
    // user's Chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('q'));
  
    form.reset();
  
    // bot's chatStripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
  
    chatContainer.scrollTop = chatContainer.scrollHeight;
  
    const messageDiv = document.getElementById(uniqueId);
  
    loader(messageDiv);
  
    // fetch data from server -> bot's response
    try {
      const response = await fetch('https://casi-live-lpx3.onrender.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: data.get('q')
        })
      })
  
      clearInterval(loadInterval);
      messageDiv.innerHTML = '';
  
      if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim();
  
        console.log({ parsedData })
  
        typeText(messageDiv, parsedData);
  
        // Use the speech synthesis API to speak the bot's response
        const msg = new SpeechSynthesisUtterance();
        msg.text = parsedData;
        window.speechSynthesis.speak(msg);
      } else {
        const err = await response.text();
        messageDiv.innerHTML = "Something went wrong";
        alert(err);
  
        // Use the speech synthesis API to speak "Something went wrong"
        const msg = new SpeechSynthesisUtterance();
        msg.text = "Something went wrong";
        window.speechSynthesis.speak(msg);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  form.addEventListener('submit', handleSubmit);
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  });
  
