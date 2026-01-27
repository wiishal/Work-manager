import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";
import {
  SpendNormalizePrompt,
  subTaskAssistancePrompt,
} from "./prompts/prompts";
import { extractJSON } from "./utils/extractJson";
dotenv.config();
const apiRouter = Router();

apiRouter.post("/subtaskAssistance", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "title and description required" });
    }

    const response = await axios.post(
      process.env.LLM_BASE_URL!,
      {
        model: "gemma",
        messages: [
          {
            role: "system",
            content: subTaskAssistancePrompt,
          },
          {
            role: "user",
            content: `Title: ${title}\nDescription: ${description}`,
          },
        ],
        temperature: 0.2,
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 60_000,
      }
    );

    const reply = response.data.choices[0].message.content;

    const cleaned = extractJSON(reply);

    try {
      const data = JSON.parse(cleaned);
      res.json(data.subtasks);
    } catch {
      console.error("Failed to parse AI JSON");
      res.status(500).json({ message: "Invalid AI response format" });
    }
  } catch (error: any) {
    console.error(error?.response?.data || error.message);
    res.status(500).json({ message: "failed during calling llm" });
  }
});

apiRouter.post("/calculateSpendAssistance", async (req, res) => {
  const { spends } = req.body;
  if (!Array.isArray(spends)) {
    return res.status(400).json({ message: "spends array required" });
  }

  try {
    const response = await axios.post(
      process.env.LLM_BASE_URL!,
      {
        model: "gemma",
        messages: [
          { role: "system", content: SpendNormalizePrompt },
          { role: "user", content: `spends: ${spends}` },
        ],
        temperature: 0,
      },
      { timeout: 60_000 }
    );

    const reply = response.data.choices[0].message.content;
    const cleaned = extractJSON(reply);
    const data = JSON.parse(cleaned);

    const items: [{ lable: string; amount: number }] = data.items.filter(
      (i: any) =>
        typeof i.label === "string" &&
        typeof i.amount === "number" &&
        i.amount > 0
    );

    const result = items.reduce((sum, item) => {
      return sum + item.amount;
    }, 0);
    res.json({  result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "failed to normalize spends" });
  }
});

export default apiRouter;
