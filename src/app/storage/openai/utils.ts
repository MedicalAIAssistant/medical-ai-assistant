import { openAIRequest } from "@/app/storage/openai";
import { trackTimeWrapper } from "@/app/utils/track-time-wrapper";

const promptOpenAIBasedOnContext = async (
  contents: string[],
  question: string
) => {
  let result;

  for (const chunk of contents) {
    const order = contents.findIndex((item) => chunk === item) + 1;
    const prompt = chunk + "\n\n" + question;
    result = await trackTimeWrapper(
      () => openAIRequest(prompt),
      `${order} prompt`
    );
    console.log(result?.data, "result");
  }
  return result;
};

const promptOpenAI = async (question: string) => {
  const result = await trackTimeWrapper(
    () => openAIRequest(question),
    `Single question prompt`
  );
  return result;
};

export const prompt = async (contents: string[], question: string) => {
  if (contents.length) {
    return await promptOpenAIBasedOnContext(contents, question);
  } else {
    return await promptOpenAI(question);
  }
};
