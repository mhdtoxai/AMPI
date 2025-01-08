const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN } = process.env;

const API_URL = "https://api-ampi.saptiva.com/ampi";
const API_TOKEN = "ampiQ5zaqnM1q8UqG4kyC-5vKwBQ/PtQZpm0hjLwh9QjGUrzzzvyfw.KMuQ!qbJNCrgyguPq8t1gVWPRW5QcjU?0dgEWET.1K35En?3S-3P8PX..s0GKj!1i2R7VwttxykX2D3TpnnJZ-kz5B0rknzBk.?5/KABVcvOFJvl0a1YhX6nVLN8f3kp-1Zh62O1I/0weAW?02N43!iEgpm1-7xP5jY58GuL80RYj.3cHhPnNid/fIo1qkVJYgXDL!b.0";

app.post("/webhook", async (req, res) => {
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));
  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

  if (message?.type === "text") {
    const senderId = message.from;
    const receivedMessage = message.text.body;

    const body = {
      from: senderId,
      query: receivedMessage,
    };

    try {
      const response = await axios.post(API_URL, body, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      const botResponse = response.data.response;
      const business_phone_number_id = req.body.entry?.[0]?.changes?.[0].value?.metadata?.phone_number_id;

      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
        headers: {
          Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          to: senderId,
          text: { body: botResponse },
          context: {
            message_id: message.id,
          },
        },
      });

      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
        headers: {
          Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          status: "read",
          message_id: message.id,
        },
      });
    } catch (error) {
      console.error("Error while interacting with the external API:", error);
    }
  }

  res.sendStatus(200);
});

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    res.sendStatus(403);
  }
});

app.get("/", (req, res) => {
  res.send(`<pre>Nothing to see here. Checkout README.md to start.</pre>`);
});

// Exporta la instancia de app
module.exports = app;
