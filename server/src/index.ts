import { Hono } from 'hono'
import { generateText } from "ai"
import { createGoogleGenerativeAI, google } from "@ai-sdk/google"

type Bindings = {
  GOOGLE_API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
  const random = Math.random() * 1000000000;
  console.log(random);
  const { text } = await generateText({
    model: createGoogleGenerativeAI({ apiKey: c.env.GOOGLE_API_KEY }).languageModel("gemini-2.0-flash-thinking-exp-01-21"),
    prompt: "Tell me something random, here is some inspiration: " + random,
  })
  return c.text(text)
})

export default app
