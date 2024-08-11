// const cron = require('node-cron');
// const TelegramApi = require('node-telegram-bot-api');
// require('dotenv').config();
// const axios = require('axios');

// const token = process.env.TELEGRAM_BOT_TOKEN;
// const bot = new TelegramApi(token, {polling: true});
/* Імпортуємо необхідні залежност */
const cron = require('node-cron');
const TelegramApi = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();
const { verseOptions, againOptions } = require('./options');
const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramApi(token, { polling: true });

//Отримуємо випадковий вірш
async function getRandomVerse() {
    try {
        // Отримуємо список книг
        const booksResponse = await axios.get('https://bible.helloao.org/api/ukr_npu/books.json');
        const books = booksResponse.data;
        const randomBook = books[Math.floor(Math.random() * books.length)];

        // Отримуємо список глав для вибраної книги
        const chaptersResponse = await axios.get(`https://bible.helloao.org/api/ukr_npu/${randomBook.slug}/chapters.json`);
        const chapters = chaptersResponse.data;
        const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];

        // Отримуємо список віршів для вибраної глави
        const versesResponse = await axios.get(`https://bible.helloao.org/api/ukr_npu/${randomBook.slug}/${randomChapter.chapter}/verses.json`);
        const verses = versesResponse.data;
        const randomVerse = verses[Math.floor(Math.random() * verses.length)];

        return `📖 ${randomBook.name} ${randomChapter.chapter}:${randomVerse.verse}\n\n${randomVerse.text}`;
    } catch (error) {
        console.error('Error fetching random verse:', error);
        return 'Вибачте, сталася помилка при отриманні випадкового вірша. Спробуйте пізніше.';
    }
}

//функція для надсилання вірша
async function sendRandomVerse(chatId) {
    const verse = await getRandomVerse();
    bot.sendMessage(chatId, verse, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Читай далі', callback_data: 'read_more' }]
            ]
        }
    });
}

//Налаштовуємо cron job для надсилання віршів
cron.schedule('0 8-21 * * *', async () => {
    const chatId = process.env.TELEGRAM_CHAT_ID; // Використовуйте реальний chatId користувача
    await sendRandomVerse(chatId);
}, {
    timezone: "Europe/Kiev" // Встановіть вашу часову зону
});

//Основний код для запуску бота
const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Привітання' },
        { command: '/info', description: 'Інфо про користувача' },
        { command: '/game', description: 'Оримати вірш' },
    ]);

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendMessage(chatId, `Привіт, ${msg.from.first_name}! Тебе вітає BlessDay бот.`);
        } else if (text === '/info') {
            await bot.sendMessage(chatId, `Тебе звуть ${msg.from.first_name} ${msg.from.last_name}!`);
        } else if (text === '/game') {
            await sendRandomVerse(chatId);
        } else {
            await bot.sendMessage(chatId, 'Я не зрозумів. Будь ласка, обери дію в МЕНЮ');
        }
    });

    console.log('Бот запущено!');
}

start();
