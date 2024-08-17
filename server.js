// Створення сервера (якщо потрібно)
const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Сервер працює на порту ${port}`);
});