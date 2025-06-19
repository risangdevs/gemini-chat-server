const { config: _config } = require("dotenv");
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

_config();
const app = express();
app.use(express.json());
app.use(cors());

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const upload = multer({ storage: multer.memoryStorage() });
const model = "gemini-2.0-flash";

app.get("/", (req, res) => {
  res.json({
    endpoints: [
      { method: "GET", path: "/", description: "List available endpoints" },
      {
        method: "POST",
        path: "/generate-text",
        description: "Generate text from a prompt",
      },
      {
        method: "POST",
        path: "/generate-from-image",
        description: "Generate text from an image and a prompt",
      },
      {
        method: "POST",
        path: "/generate-from-document",
        description: "Summarize a document",
      },
      {
        method: "POST",
        path: "/generate-from-audio",
        description: "Transcribe audio",
      },
    ],
  });
});
app.post("/generate-text", async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: "No body provided" });
  }
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    const result = await genAI.models.generateContent({
      model,
      config: {
        temperature: 0.5,
      },
      contents: [
        {
          text: prompt,
        },
      ],
    });
    const text = result.text;
    res.json({ output: text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/generate-from-image", upload.single("image"), async (req, res) => {
  const prompt = req.body.prompt || "Describe the image";
  const buffer = req.file.buffer;
  const base64Data = buffer.toString("base64");
  const mimeType = req.file.mimetype || "image/png";
  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }
  try {
    const result = await genAI.models.generateContent({
      model,
      config: {
        // temperature: 0.5,
      },
      contents: [
        {
          text: prompt,
        },
        imagePart,
      ],
    });
    const text = result.text;
    res.json({ output: text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post(
  "/generate-from-document",
  upload.single("document"),
  async (req, res) => {
    const prompt = req.body.prompt || "Summarize the document";
    const buffer = req.file.buffer;
    const base64Data = buffer.toString("base64");
    const mimeType = req.file.mimetype || "application/pdf";
    if (!req.file) {
      return res.status(400).json({ error: "No document file provided" });
    }
    try {
      const documentPart = {
        inlineData: {
          data: base64Data,
          mimeType,
        },
      };
      const result = await genAI.models.generateContent({
        model,
        config: {
          // temperature: 0.5,
        },
        contents: [
          {
            text: prompt,
          },
          documentPart,
        ],
      });
      const text = result.text;
      res.json({ output: text });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

app.post("/generate-from-audio", upload.single("audio"), async (req, res) => {
  const prompt = req.body.prompt || "Transcribe the audio";
  const buffer = req.file.buffer;
  const base64Data = buffer.toString("base64");
  const mimeType = req.file.mimetype || "audio/mpeg";
  const audioPart = {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
  if (!req.file) {
    return res.status(400).json({ error: "No audio file provided" });
  }
  try {
    const result = await genAI.models.generateContent({
      model,
      config: {
        // temperature: 0.5,
      },
      contents: [
        {
          text: prompt,
        },
        audioPart,
      ],
    });
    const text = result.text;
    res.json({ output: text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;

module.exports = app;