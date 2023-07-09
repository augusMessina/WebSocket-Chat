import type { NextRequest } from 'next/server'

import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'

export const config = {
  runtime: 'edge'
}

const apiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY!,
})

const openai = new OpenAIApi(apiConfig)

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: Request) {
  // Extract the `messages` from the body of the request
  const {messages} = await req.json();

  const prompt: ChatCompletionRequestMessage[] = [{
    role: "system",
    content:
      "You are a friendly user of a chat application, so behave like one, acting as a young human who knows how to listen and brings up funny jokes and interesting topics of conversations.",
  }];

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: prompt.concat(messages),
    max_tokens: 200,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)

  // Respond with the stream
  return new StreamingTextResponse(stream)

  
}

