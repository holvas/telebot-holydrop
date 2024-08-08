const cron = require('node-cron');
const TelegramApi = require('node-telegram-bot-api');
require('dotenv').config();
const axios = require('axios');

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramApi(token, {polling: true});
