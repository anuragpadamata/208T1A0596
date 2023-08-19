const express = require('express');
const axios = require('axios');
const app = express();
const port = 8008;

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'Invalid URLs' });
  }

  const numberSets = await Promise.all(
    urls.map(async (url) => {
      try {
        const response = await axios.get(url, { timeout: 500 });
        return response.data.numbers;
      } catch (error) {
        console.error(`Error fetching data from ${url}: ${error.message}`);
        return [];
      }
    })
  );

  const mergedNumbers = Array.from(new Set(numberSets.flat())).sort((a, b) => a - b);

  res.json({ numbers: mergedNumbers });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});