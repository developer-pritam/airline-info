const functions = require("firebase-functions");
const { Configuration, OpenAIApi } = require("openai");
const formidable = require("formidable-serverless");

const configuration = new Configuration({
  apiKey: "API_KEY",
});
const openai = new OpenAIApi(configuration);

async function airBot(userMessage) {
  console.log(userMessage);
  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt:
      "Air Bot serves as the assistant to customers visiting the airline website. The website will provide the details of flight between two places entered by the user. The website will also provide the cheapest fare for the airline. The website will enable audio respone when listen button is selected. Chat assistant for airline website where user can check the cheapest :\n \nUser : Who are you?\nBot : My name is airbot and I am your assistant\nUser : " +
      userMessage,
    temperature: 0.5,
    max_tokens: 120,
    top_p: 0.3,
    frequency_penalty: 0.5,
    presence_penalty: 0,
  });
  console.log(response.data.choices[0].text);
  return response.data.choices[0].text
    .replaceAll("\n", "")
    .replaceAll("Bot:", "")
    .trim();
}

exports.airBotResp = functions.https.onRequest(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  //   console.log(request.body.userMessage);
  //   console.log("shjgu");
  if (request.method === "OPTIONS") {
    // stop preflight requests here
    response.status(204).send("");
    return;
  } else {
    const msg = await airBot(request.body.userMessage);
    response.send(msg);
  }
});
