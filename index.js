const cron = require('node-cron');
const TelegramApi = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();
const { againOptions } = require('./options');  // Імпортуємо опції з options.js
const token = process.env.TELEGRAM_BOT_TOKEN;
console.log(token);

const bot = new TelegramApi(token, { polling: true });
const userState = {}; // Об'єкт для збереження стану користувача (вибраної книги, глави тощо)

// Функція для отримання списку книг з API
async function getBooks() {
    const response = await axios.get('https://bible.helloao.org/api/ukr_npu/books.json');
    return response.data;
}

// Функція для отримання списку глав певної книги
async function getChapters(bookSlug) {
    const response = await axios.get(`https://bible.helloao.org/api/ukr_npu/${bookSlug}/chapters.json`);
    return response.data;
}

// Функція для отримання списку віршів у певній главі
async function getVerses(bookSlug, chapterNumber) {
    const response = await axios.get(`https://bible.helloao.org/api/ukr_npu/${bookSlug}/${chapterNumber}/verses.json`);
    return response.data;
}

// Функція для отримання тексту певного вірша
async function getVerse(bookSlug, chapterNumber, verseNumber) {
    const response = await axios.get(`https://bible.helloao.org/api/ukr_npu/${bookSlug}/${chapterNumber}/${verseNumber}.json`);
    return response.data;
}

// Функція для надсилання випадкового вірша з API користувачу
async function sendRandomVerse(chatId) {
    const randomData = await getRandomVerse();
    const verseMessage = `📖 ${randomData.book.name} ${randomData.chapter.chapter}:${randomData.verse.verse}\n\n${randomData.verse.text}`;

    bot.sendMessage(chatId, verseMessage, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Читай далі', callback_data: 'choose_book' }]
            ]
        }
    });
}

// Обробка callback-запитів від користувача
bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === 'choose_book') {
        const books = await getBooks();
        const bookButtons = books.map(book => [{ text: book.name, callback_data: `choose_chapter:${book.slug}` }]);

        await bot.sendMessage(chatId, 'Оберіть книгу:', {
            reply_markup: {
                inline_keyboard: bookButtons
            }
        });

    } else if (data.startsWith('choose_chapter')) {
        const [action, bookSlug] = data.split(':');
        userState[chatId] = { bookSlug };
        await bot.sendMessage(chatId, 'Введіть номер глави:');

    } else if (data.startsWith('choose_verse')) {
        const [action, bookSlug, chapterNumber] = data.split(':');
        userState[chatId].chapterNumber = chapterNumber;
        await bot.sendMessage(chatId, 'Введіть номер вірша:');

    } else if (data === '/again') {
        await sendRandomVerse(chatId);
    }
});

// Обробка текстових повідомлень від користувача
bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
        await bot.sendMessage(chatId, `Привіт, ${msg.from.first_name}! Тебе вітає BlessDay бот.`);
    } else if (text === '/info') {
        await bot.sendMessage(chatId, `Тебе звуть ${msg.from.first_name} ${msg.from.last_name}!`);
    } else if (text === '/game') {
        await sendRandomVerse(chatId);
    } else if (userState[chatId] && !userState[chatId].chapterNumber) {
        const chapterNumber = parseInt(text);
        const chapters = await getChapters(userState[chatId].bookSlug);

        if (chapterNumber > 0 && chapterNumber <= chapters.length) {
            userState[chatId].chapterNumber = chapterNumber;
            await bot.sendMessage(chatId, `Ви вибрали главу ${chapterNumber}. Введіть номер вірша:`);
        } else {
            await bot.sendMessage(chatId, `Неправильний номер глави. У книзі є ${chapters.length} глав.`);
        }

    } else if (userState[chatId] && userState[chatId].chapterNumber && !userState[chatId].verseNumber) {
        const verseNumber = parseInt(text);
        const verses = await getVerses(userState[chatId].bookSlug, userState[chatId].chapterNumber);

        if (verseNumber > 0 && verseNumber <= verses.length) {
            const verse = await getVerse(userState[chatId].bookSlug, userState[chatId].chapterNumber, verseNumber);
            userState[chatId].verseNumber = verseNumber;
            await bot.sendMessage(chatId, `📖 ${verse.text}`, againOptions);
        } else {
            await bot.sendMessage(chatId, `Неправильний номер вірша. У главі є ${verses.length} віршів.`);
        }
    } else {
        await bot.sendMessage(chatId, 'Я не зрозумів. Будь ласка, обери дію в МЕНЮ');
    }
});

// Cron-завдання для відправки випадкового вірша щогодини з 8:00 до 21:00
cron.schedule('0 8-21 * * *', async () => {
    const chatId = process.env.TELEGRAM_CHAT_ID; // Використовуйте реальний chatId користувача
    await sendRandomVerse(chatId);
}, {
    timezone: "Europe/Kiev"
});

// Функція, яка запускає бот і встановлює команди
const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Привітання' },
        { command: '/info', description: 'Інфо про користувача' },
        { command: '/game', description: 'Оримати вірш' },
    ]);

    console.log('Бот запущено!');
}

// Запуск бота
start();




/* /* Імпортуємо необхідні залежност */
// const cron = require('node-cron');
// const TelegramApi = require('node-telegram-bot-api');
// const axios = require('axios');
// require('dotenv').config();
// const { verseOptions, againOptions } = require('./options');
// const token = process.env.TELEGRAM_BOT_TOKEN;

// const bot = new TelegramApi(token, { polling: true });

// //Отримуємо випадковий вірш
// async function getRandomVerse() {
//     try {
//         // Отримуємо список книг
//         const booksResponse = await axios.get('https://bible.helloao.org/api/ukr_npu/books.json');
//         const books = booksResponse.data;
//         const randomBook = books[Math.floor(Math.random() * books.length)];

//         // Отримуємо список глав для вибраної книги
//         const chaptersResponse = await axios.get(`https://bible.helloao.org/api/ukr_npu/${randomBook.slug}/chapters.json`);
//         const chapters = chaptersResponse.data;
//         const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];

//         // Отримуємо список віршів для вибраної глави
//         const versesResponse = await axios.get(`https://bible.helloao.org/api/ukr_npu/${randomBook.slug}/${randomChapter.chapter}/verses.json`);
//         const verses = versesResponse.data;
//         const randomVerse = verses[Math.floor(Math.random() * verses.length)];

//         return `📖 ${randomBook.name} ${randomChapter.chapter}:${randomVerse.verse}\n\n${randomVerse.text}`;
//     } catch (error) {
//         console.error('Error fetching random verse:', error);
//         return 'Вибачте, сталася помилка при отриманні випадкового вірша. Спробуйте пізніше.';
//     }
// }

// //функція для надсилання вірша
// async function sendRandomVerse(chatId) {
//     const verse = await getRandomVerse();
//     bot.sendMessage(chatId, verse, {
//         reply_markup: {
//             inline_keyboard: [
//                 [{ text: 'Читай далі', callback_data: 'read_more' }]
//             ]
//         }
//     });
// }

// //Налаштовуємо cron job для надсилання віршів
// cron.schedule('0 8-21 * * *', async () => {
//     const chatId = process.env.TELEGRAM_CHAT_ID; // Використовуйте реальний chatId користувача
//     await sendRandomVerse(chatId);
// }, {
//     timezone: "Europe/Kiev" // Встановіть вашу часову зону
// });

// //Основний код для запуску бота
// const start = () => {
//     bot.setMyCommands([
//         { command: '/start', description: 'Привітання' },
//         { command: '/info', description: 'Інфо про користувача' },
//         { command: '/game', description: 'Оримати вірш' },
//     ]);

//     bot.on('message', async msg => {
//         const text = msg.text;
//         const chatId = msg.chat.id;

//         if (text === '/start') {
//             await bot.sendMessage(chatId, `Привіт, ${msg.from.first_name}! Тебе вітає BlessDay бот.`);
//         } else if (text === '/info') {
//             await bot.sendMessage(chatId, `Тебе звуть ${msg.from.first_name} ${msg.from.last_name}!`);
//         } else if (text === '/game') {
//             await sendRandomVerse(chatId);
//         } else {
//             await bot.sendMessage(chatId, 'Я не зрозумів. Будь ласка, обери дію в МЕНЮ');
//         }
//     });

//     console.log('Бот запущено!');
// }

// start();*/
