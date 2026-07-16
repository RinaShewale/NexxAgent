import { Router } from "express";
import { agent } from "../agents/code.agent.js";

const AgentRouter = Router();

AgentRouter.post("/invoke", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const response = await agent.invoke({
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    return res.status(200).json({
      success: true,
      result: response.messages.at(-1).content,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default AgentRouter;