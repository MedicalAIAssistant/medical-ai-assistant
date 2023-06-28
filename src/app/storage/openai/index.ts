const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OpenAIApiKey,
});

const openai = new OpenAIApi(configuration);

/**
 * @deprecated We can not use createCompletion because it is used Axios with XHR
 * under the hood and can't be run on edge with streaming because worker used fetch. 
 * To fix it we should use adapter https://github.com/openai/openai-node/issues/30
 */
const openAIRequestOld = async (prompt: string) => {
  return await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    temperature: 0,
    max_tokens: 1024,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });
};

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

export const openAIRequest = async (prompt: string) => {
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
