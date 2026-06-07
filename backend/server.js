import "dotenv/config";
import express from "express";
import cors from "cors";
import { ChatMistralAI } from "@langchain/mistralai";
import { tool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";
import { sendEmail } from "./mail.service.js";
import supabase from "./supabase.js";
import * as z from "zod";

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  credentials: false
}));
app.use(express.json());

const model = new ChatMistralAI({ model: "mistral-small-latest" });

const createEmailTool = (userId) =>
  tool(
    async ({ to, subject, html }) => {
      const result = await sendEmail({ to, subject, html });
      try {
        await supabase.from("sent_emails").insert([
          {
            user_id: userId ?? null,
            to_email: to,
            subject,
            body: html,
            sent_at: new Date(),
          },
        ]);
      } catch (dbError) {
        console.error("❌ Failed to save sent email to Supabase:", dbError);
      }
      return result;
    },
    {
      name: "emailTool",
      description: "Use this tool to send an email",
      schema: z.object({
        to: z.string().describe("Recipient email address"),
        html: z.string().describe("HTML content of the email"),
        subject: z.string().describe("Subject of the email"),
      }),
    }
  );

// Conversation sessions store (in-memory)
const sessions = {};

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  const { message, sessionId, userId } = req.body;

  if (!sessions[sessionId]) sessions[sessionId] = [];

  sessions[sessionId].push(new HumanMessage(message));

  const emailTool = createEmailTool(userId);
  const agent = createReactAgent({ llm: model, tools: [emailTool] });

  try {
    const response = await agent.invoke({
      messages: sessions[sessionId],
    });

    const lastMsg = response.messages[response.messages.length - 1];
    sessions[sessionId].push(lastMsg);

    res.json({ reply: lastMsg.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));