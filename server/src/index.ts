import { Hono } from 'hono'
import { generateObject, generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { z } from 'zod'
import { logger } from 'hono/logger'
import { zValidator } from '@hono/zod-validator'

type Bindings = {
  GOOGLE_API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use(logger())

app.get('/', async (c) => {
  const model = createGoogleGenerativeAI({ apiKey: c.env.GOOGLE_API_KEY }).languageModel("gemini-2.0-flash-thinking-exp-01-21")

  const random = Math.random() * 1000000000;
  console.log(random);
  const { text } = await generateText({
    model,
    prompt: "Tell me something random, here is some inspiration: " + random,
  })
  return c.text(text)
})

app.post('/cards', zValidator('json', z.object({
  topic: z.string().min(1),
})), async (c) => {
  const { topic } = c.req.valid('json')

  const model = createGoogleGenerativeAI({ apiKey: c.env.GOOGLE_API_KEY }).languageModel("gemini-2.0-flash-exp")

  const { object } = await generateObject({
    model,
    schema: z.object({
      topic: z.string(),
      cards: z.array(z.object({
        question: z.string(),
        answer: z.string(),
      })),
    }),
    temperature: 1,
    prompt: `Generate a set of flashcards for the topic: ${topic}. Find a suitable name for the flashcards.`,
  });
  return c.json(object)
})

export default app
