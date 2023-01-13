const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "API_KEY",
});
const openai = new OpenAIApi(configuration);

async function airelineFare(from, to) {
  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: `Airline assistant that give fare between two airports and link of the website to book ticket:\n\nUser: ${from}-${to}
      Bot:`,
    temperature: 0.5,
    max_tokens: 120,
    top_p: 0.3,
    frequency_penalty: 0.5,
    presence_penalty: 0,
  });
  console.log(response.data.choices[0].text);
  return response.data.choices[0].text
    .replaceAll("\n", "")
    .replace("Bot:", "")
    .trim();
}

exports.airlineCost = functions.https.onRequest(async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "*");
  cors(req, res, async () => {
    // your function body here - use the provided req and res from cors

    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST");

    if (req.method === "OPTIONS") {
      // stop preflight requests here
      res.status(204).send("");
      return;
    } else {
      const cost = await airelineFare(req.body.from, req.body.to);
      res.send(cost);
    }
  });
});
