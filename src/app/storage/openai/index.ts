const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OpenAIApiKey,
});

const openai = new OpenAIApi(configuration);

export const openAIRequest = async (prompt: string) => {
  console.log(process.env.OpenAIApiKey?.toLocaleUpperCase() + 'a', 'api key')
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
