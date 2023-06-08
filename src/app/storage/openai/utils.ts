import { openAIRequest } from "@/app/storage/openai";
import { trackTimeWrapper } from "@/app/utils/track-time-wrapper";

export const promptOpenAI = async (contents: string[], question: string) => {
  let result;

  for (const chunk of contents) {
    const order = contents.findIndex(item => chunk === item) + 1;
    const prompt = chunk + "\n\n" + question;
    result = await trackTimeWrapper(() => openAIRequest(prompt), `${order} prompt`)
    console.log(result?.data, "result");
  }
  return result;
};
