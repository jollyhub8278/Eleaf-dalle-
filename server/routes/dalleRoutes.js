import express from 'express';
import * as dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure the environment variable is correctly set
});

// GET route for testing
router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from DALL-E!' });
});

// POST route to generate an image
router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const aiResponse = await openai.images.generate({
      model: "dall-e-3", // Specify the model
      prompt: prompt,    // Pass the prompt from the request
      n: 1,              // Number of images
      size: '1024x1024', // Image size
      response_format: 'b64_json', // Base64 encoding for the response
    });

    const image = aiResponse.data[0].b64_json; // Access the image data
    res.status(200).json({ photo: image });    // Return the generated image
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: error?.response?.data?.error?.message || 'Something went wrong',
    });
  }
});

export default router;
