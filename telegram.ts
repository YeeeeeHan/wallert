require("dotenv").config();

import { VercelRequest, VercelResponse } from "@vercel/node";
import { Telegraf } from "telegraf";
const watcher = require('./listener/watcher.js')
import {handleTestCommand, handleOnMessage} from "./api/handler/handler";
import { TelegrafContext } from "telegraf/typings/context";

export const BOT_TOKEN = process.env.BOT_TOKEN;
export const DOMAIN_URL = process.env.DOMAIN_URL;
console.log("@@@@@@@@@@@", BOT_TOKEN);
const SECRET_HASH = "32e58fbahey833349df3383dc910e180";
// Note: change to false when running locally
const BASE_PATH =
  process.env.VERCEL_ENV === "production"
    ? "<https://yourdomain.com>"
    : "https://telegram-bot-jsjoeio.jsjoeio.coder.app";
const bot = new Telegraf(BOT_TOKEN!);


// Run watcher
watcher.watchEtherTransfers(bot)


// Listen for telegram bot commands
bot.command("test", async (ctx) => {
  await handleTestCommand(ctx);
});

bot.on("message", async (ctx) => {
  await handleOnMessage(ctx);
});

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // Retrieve the POST request body that gets sent from Telegram
    const { body, query } = req;

    if (query.setWebhook === "true") {
      const webhookUrl = `${BASE_PATH}/api/telegram-hook?secret_hash=${SECRET_HASH}`;

      // Would be nice to somehow do this in a build file or something
      const isSet = await bot.telegram.setWebhook(webhookUrl);
      console.log(`Set webhook to ${webhookUrl}: ${isSet}`);
    }

    if (query.secret_hash === SECRET_HASH) {
      await bot.handleUpdate(body);
    }
  } catch (error) {
    // If there was an error sending our message then we
    // can log it into the Vercel console
    console.error("Error sending message");
    if (error instanceof Error) {
      // ✅ TypeScript knows err is Error
      console.log(error.message);
    }

    // Acknowledge the message with Telegram
    // by sending a 200 HTTP status code
    // The message here doesn't matter.
    res.status(200).send("OK");
  }
};

// Start webhook via launch method (preferred)
bot.launch({
  webhook: {
    // Public domain for webhook; e.g.: example.com
    domain: DOMAIN_URL,

    // Port to listen on; e.g.: 8080
    port: 3000,
  },
});
