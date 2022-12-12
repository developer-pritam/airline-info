let send = document.querySelector("#send");
let chatbox = document.querySelector("#chat-box");
let message = document.querySelector("#message");
let speak;
document.getElementById("message").onkeydown = function (e) {
  if (e.keyCode == 13) {
    // submit
    sendMessage();
  }
};
function sendMessage() {
  const msg = message.value;

  if (!msg) return;
  console.log(msg);

  chatbox.innerHTML += `<div class="chat sender">
      <img
        src="./user.jpg"
        alt=""
      />
      <p class="msg">
        <ion-icon name="caret-back-outline"></ion-icon>
      ${msg}
      </p>
    </div>`;
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    userMessage: msg,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  fetch(
    "http://localhost:5001/fir-project-82e95/us-central1/airbot",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      result = result.replaceAll("Bot :", "");
      speak(result);
      chatbox.innerHTML += `<div class="chat bot">
        <img
          src="./bot.webp"
          alt=""
        />
        <p class="msg">
          <ion-icon name="caret-back-outline"></ion-icon>
        ${result}
        </p>
      </div>`;
    })
    .catch((error) => console.log("error", error));

  message.value = "";
}

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
