import { Configuration, OpenAIApi } from "openai-edge";

const configuration = new Configuration({
  apiKey: process.env.OpenAIApiKey,
});

const openai = new OpenAIApi(configuration);

const openAIStreamPayload = {
  model: "gpt-3.5-turbo",
  temperature: 0.7,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  max_tokens: 1000,
  stream: true,
  n: 1,
};

// https://nextjs.org/docs/app/building-your-application/routing/router-handlers#streaming
// https://github.com/dan-kwiat/openai-edge#edge-route-handler-examples
export const openAIRequest = async (prompt: string) => {
  return await openai.createChatCompletion({
    ...openAIStreamPayload,
    messages: [{ role: "user", content: prompt }],
  });
};

/**
 * @deprecated We can call OpenAI directly via fetch, but better to use openai-edge api
 * Notice: we can't use just "openai" as it doesn't allow streaming
 * https://github.com/openai/openai-node/issues/30
 */
export const openAIRequestOld = async (prompt: string) => {
  return await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OpenAIApiKey ?? ""}`,
    },
    method: "POST",
    body: JSON.stringify({
      ...openAIStreamPayload,
      messages: [{ role: "user", content: prompt }],
    }),
  });
};
