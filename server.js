require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

// Используем порт из переменной окружения или 3000 по умолчанию
const port = process.env.PORT || 3000;

app.use(express.json());

// Обработка GET-запроса для корневого маршрута
app.get('/', (req, res) => {
  res.send('API работает!');
});

const HF_API_KEY = process.env.HF_API_KEY;

app.post('/webhook', async (req, res) => {
  const userMessage = req.body.queryResult.queryText;

  const prompt = `Ты Альтушка: милая, саркастичная, мемная подруга, которая всегда поддерживает собеседника. Пользователь спросил: "${userMessage}"`;

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/gpt2',
      { inputs: prompt },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const generatedText = response.data.generated_text || "Ой, что-то пошло не так, котик 🖤";
    res.json({ fulfillmentText: generatedText.trim() });
  } catch (error) {
    console.error('Error during API call:', error);
    res.json({ fulfillmentText: "Упс, зай, ошибка на сервере 😿" });
  }
});

app.listen(port, () => {
  console.log(`Альтушка онлайн на порту ${port}!`);
});
