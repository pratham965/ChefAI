const express = require('express');
const getRecipe = require('./ai');
const cors = require("cors");
require('dotenv').config();
const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors())

app.use(express.json())

app.post('/api/recipe', async (req, res) => {
    const { ingredients } = req.body
    const recipe = await getRecipe(ingredients)
    res.json({recipe:recipe})
})

app.listen(PORT,  () => {
    console.log(`Server running on ${PORT}`);
  });