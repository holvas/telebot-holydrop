// /* -- Імпорт та налаштування -- */

// // Імпорт бібліотек
// const TelegramApi = require("node-telegram-bot-api");
// const axios = require("axios");
// const schedule = require('node-schedule');
// const express = require('express');
// require("dotenv").config();

// //Налаштування Telegram бота
// const token = process.env.TELEGRAM_BOT_TOKEN; //токен бота
// const bot = new TelegramApi(token, { polling: true }); //Запуск бота в режимі опитування, щоб отримувати оновлення від Telegram

// //Реалізація привітання користувачів
// bot.onText(/\/start/, (msg) => {
//     const chatId = msg.chat.id;
//     const userName = msg.from.first_name || 'Користувач';
//     // Вітальне повідомлення
//     bot.sendMessage(chatId, `Вітаю тебе, ${userName}`);
// });

// /* -- Отримання переліку книг з API -- */

// // функція для отримання переліку книг
// async function getBooksList() {
//     try {
//         const response = await axios.get('https://bible.helloao.org/api/ukr_npu/books.json');
//         const booksList =  response.data.books; // Звертаємося до властивості books
        
//          // Перевірка, чи є `booksList` масивом
//          if (Array.isArray(booksList)) {
//              return booksList;
//          } else {
//              throw new Error('Невірний формат даних для переліку книг');
//          }
//     } catch (error) {
//         console.error('Помилка отримання книг:', error);
//         return null;
//     }
// };

// // Обробка команди для виводу переліку книг
// bot.onText(/Перелік книг/, async (msg) => {
//     const chatId = msg.chat.id;
//     const booksList = await getBooksList();

//     if (booksList) {
//         let reply = 'Ось перелік книг Нового Заповіту:\n\n';
//         booksList.forEach((book) => {
//             reply += `${book.name}\n`;
//         });
//         bot.sendMessage(chatId, reply);
//     } else {
//         bot.sendMessage(chatId, 'Виникла помилка при отриманні переліку книг.');
//     }
// });


// /* -- Створення інтерактивного меню -- */

// // Додання кнопки до головного меню
// bot.onText(/\/start/, (msg) => {
//     const chatId = msg.chat.id;

//     const options = {
//         reply_markup: {
//             keyboard: [
//                 [{ text: 'Перелік книг' }],
//                 [{ text: 'Випадковий вірш' }],
//             ],
//             resize_keyboard: true,
//             one_time_keyboard: true
//         }
//     };

//     bot.sendMessage(chatId, 'Обери дію:', options);
// });


// /* -- Випадковий вірш з випадкової глави -- */

// // функція для отримання випадкового вірша

// // async function getRandomVerse() {
// //     try {
// //         const booksList = await getBooksList();
// //         const randomBook = booksList[Math.floor(Math.random() * booksList.length)];
// //         const bookId = randomBook.id;

// //         const chaptersResponse = await axios.get(`https://bible.helloao.org/api/ukr_npu/${bookId}.json`);
// //         const chapters = chaptersResponse.data.book.totalNumberOfChapters;
// //         const randomChapter = Math.floor(Math.random() * chapters) + 1;

// //         const verseResponse = await axios.get(`https://bible.helloao.org/api/ukr_npu/${bookId}/${randomChapter}.json`);
// //         const chapterContent = verseResponse.data.chapter.content;

// //         // Фільтруємо тільки ті елементи, що є віршами
// //         const verses = chapterContent.filter(item => item.type === 'verse');

// //         // Вибираємо випадковий вірш
// //         const randomVerse = verses[Math.floor(Math.random() * verses.length)];

// //         // Повертаємо текст вірша
// //         return randomVerse.content.join(' '); // Якщо вірш розділений на частини, об'єднуємо їх в рядок
// //     } catch (error) {
// //         console.error('Помилка отримання випадкового вірша:', error);
// //         return null;
// //     }
// // }

// // async function getRandomVerse() {
// //     try {
// //         // Отримуємо список книг
// //         const booksResponse = await axios.get('https://bible.helloao.org/api/ukr_npu/books.json');
// //         const books = booksResponse.data.books;
        
// //         // Вибираємо випадкову книгу
// //         const randomBook = books[Math.floor(Math.random() * books.length)];
// //         const bookName = randomBook.name;  // Використовуємо властивість name
        
// //         // Формуємо URL для запиту до першого розділу вибраної книги
// //         const firstChapterUrl = `https://bible.helloao.org/api/ukr_npu/${encodeURIComponent(bookName)}/1.json`;
// //         const chaptersResponse = await axios.get(firstChapterUrl);

// //         // Виводимо всю відповідь для перевірки
// //         console.log(chaptersResponse.data);

// //         // Перевіряємо наявність даних та отримуємо загальну кількість розділів
// //         if (chaptersResponse.data && chaptersResponse.data.translation) {
// //             const totalChapters = chaptersResponse.data.translation.totalNumberOfChapters;

// //             // Вибираємо випадковий розділ
// //             const randomChapterNumber = Math.floor(Math.random() * totalChapters) + 1;

// //             // Формуємо URL для запиту до випадкового розділу
// //             const chapterUrl = `https://bible.helloao.org/api/ukr_npu/${encodeURIComponent(bookName)}/${randomChapterNumber}.json`;
// //             const chapterResponse = await axios.get(chapterUrl);

// //             // Отримуємо вміст розділу (масив content)
// //             const chapterContent = chapterResponse.data.chapter.content;

// //             // Фільтруємо вміст для отримання тільки віршів
// //             const verses = chapterContent.filter(content => content.type === 'verse');

// //             // Вибираємо випадковий вірш
// //             const randomVerse = verses[Math.floor(Math.random() * verses.length)];

// //             console.log(`Випадковий вірш: ${randomVerse.number} - ${randomVerse.content.join(' ')}`);
// //         } else {
// //             console.error('Дані про кількість розділів відсутні');
// //         }
        
// //     } catch (error) {
// //         console.error('Помилка отримання випадкового вірша:', error.message);
// //     }
// // }
// // getRandomVerse();

// // Обробка команди для виводу випадкового вірш
// bot.onText(/Випадковий вірш/, async (msg) => {
//     const chatId = msg.chat.id;
//     const verse = await getRandomVerse();

//     if (verse) {
//         bot.sendMessage(chatId, `Ось випадковий вірш:\n\n${verse}`);
//     } else {
//         bot.sendMessage(chatId, 'Не вдалося отримати випадковий вірш.');
//     }
// });


// /* -- Планування повідомлень -- */

// // Планувальник для відправки випадкових віршів
// schedule.scheduleJob('0 8-21 * * *', async () => {
//     const chatId = 'YOUR_CHAT_ID';
//     const verse = await getRandomVerse();

//     if (verse) {
//         bot.sendMessage(chatId, `Нагадування:\n\n${verse}`);
//     }
// });


fetch('https://bible.helloao.org/api/available_translations.json')
    .then(response => response.json())
    .then(availableTranslations => {
        // Створюємо рядок із інформацією про переклади
        let translationsText = 'Available translations:\n\n';
        availableTranslations.translations.forEach(translation => {
            translationsText += `ID: ${translation.id}\nName: ${translation.name}\nEnglish Name: ${translation.englishName}\nLanguage: ${translation.languageName || 'Unknown'}\n\n`;
        });

        // Виводимо результат
        console.log(translationsText);
        translationsText; // Повертаємо текст
    })
    .catch(error => {
        console.error('Error fetching translations:', error);
        'Error fetching translations'; // Повертаємо текст помилки
    });
