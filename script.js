let origin = document.querySelector("#origin");
let destination = document.querySelector("#destination");
let check = document.querySelector("#check");
let tempIcon = document.querySelector("#tempIcon");
let weatherCountry = document.querySelector("#weatherCountry");
let temperature = document.querySelector("#temperature");
let weatherDescription = document.querySelector("#weatherDescription");
let feelsLike = document.querySelector("#feelsLike");
let humidity = document.querySelector("#humidity");
let longitude = document.querySelector("#longitude");
let latitude = document.querySelector("#latitude");
let logout = document.querySelector("#logout");
let mic = document.querySelector("#mic");

let speak;
const resultBox = document.querySelector("#resultBox");
const container = document.querySelector("#container");

// var mydata = JSON.parse(country);
addCountry();
async function addCountry() {
  fetch("IndiaList.json")
    .then((response) => response.json())
    .then((json) => {
      let airportList = json;

      airportList = airportList.sort((a, b) => (a.city > b.city ? 1 : -1));

      // console.log(countryList.length);
      origin.innerHTML =
        '<option value="" disabled selected>Select Origin Airport</option>';
      destination.innerHTML =
        '<option value="" disabled selected>Select Destination Airport</option>';
      for (let index = 0; index < airportList.length; index++) {
        // console.log(airportList[index]);
        origin.innerHTML += `<option value="${airportList[index].city}">${airportList[index].city}</option>`;
        destination.innerHTML += `<option value="${airportList[index].city}">${airportList[index].city}</option>`;
      }
    });
}
const firebaseConfig = {
  apiKey: "AIzaSyBL05UJYeWQE3THbV_51h0aI2ktTjhNhVs",
  authDomain: "weather-website-application.firebaseapp.com",
  projectId: "weather-website-application",
  storageBucket: "weather-website-application.appspot.com",
  messagingSenderId: "12468957012",
  appId: "1:12468957012:web:6a3d1f7221c4ce894f22c1",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// console.log(firebase);

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var uid = user.uid;

    console.log(uid);
  } else {
    // User is signed out
    console.log("not logged in");
    window.location.replace("./login.html");
  }
});

check.addEventListener("click", () => {
  if (origin.value == "" || destination.value == "") {
    resultBox.innerHTML = "Please select both the airports";
    console.log("Please select both the airports");
    return;
  }
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  console.log(origin);
  var raw = JSON.stringify({
    from: origin.value,
    to: destination.value,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  resultBox.innerHTML = "Loading...";
  fetch(
    "https://us-central1-fir-project-82e95.cloudfunctions.net/airlineCost",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      resultBox.innerHTML = result;
      // speak(result);
    })
    .catch((error) => console.log("error", error));
});
mic.addEventListener("click", () => {
  speak(resultBox.innerHTML);
});

logout.addEventListener("click", () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      alert("Logged out successfully");
    })
    .catch((error) => {
      // An error happened.
      alert("Error logging out");
    });
});
let voice = null;

window.onload = () => {
  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "Client-ID hrphI5mplxv7WzAJw_qQAqTnibdEafmlOLjsKpiptLM"
  );

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(
    "https://api.unsplash.com/photos/random?query=airline&orientation=landscape",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      container.style.backgroundImage = `url("${result.urls.regular}")`;
      console.log(result);
    })
    .catch((error) => console.log("error", error));

  // (A) TTS SUPPORTED
  if ("speechSynthesis" in window) {
    // (B) GET HTML ELEMENTS

    // (C) POPULATE AVAILABLE VOICES
    var voices = () => {
      speechSynthesis.getVoices().forEach((v, i) => {
        console.log(v);
        voice = i;
        let opt = document.createElement("option");
        opt.value = i;
        opt.innerHTML = v.name;
        vlist.appendChild(opt);
      });
    };
    voices();
    speechSynthesis.onvoiceschanged = voices;

    // (D) SPEAK
    speak = (voiceMSG) => {
      let msg = new SpeechSynthesisUtterance();
      msg.voice = speechSynthesis.getVoices()[voice];
      msg.text = voiceMSG;
      speechSynthesis.speak(msg);
      return false;
    };

    // (E) ENABLE FORM
    demo.onsubmit = speak;
    vlist.disabled = false;
    vvol.disabled = false;
    vpitch.disabled = false;
    vrate.disabled = false;
    vmsg.disabled = false;
    vgo.disabled = false;
  }

  // (X) TTS NOT SUPPORTED
  else {
    alert("Text-to-speech is not supported on your browser!");
  }
};
