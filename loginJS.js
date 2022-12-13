let username = document.querySelector("#username");
let password = document.querySelector("#password");
let submitBtn = document.querySelector("#submitBtn");
let form = document.querySelector("#form");
let signup = document.querySelector("#signupBtn");

// Adds a listener for the "submit" event.
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
    window.location.replace("/");
  } else {
    // User is signed out
    console.log("not logged in");
  }
});

form.addEventListener("submit", function (e) {
  console.log(username.value, password.value);

  e.preventDefault();

  firebase
    .auth()
    .signInWithEmailAndPassword(username.value, password.value)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // ...
      window.location.replace("/");
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
      alert(errorMessage);
    });
});

signup.addEventListener("click", () => {
  window.location.replace("./signup.html");
});

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
      document.body.style.backgroundImage = `url("${result.urls.regular}")`;
      console.log(result);
    })
    .catch((error) => console.log("error", error));
};
