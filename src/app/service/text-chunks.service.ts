export const textToChunks = (
  texts: string[],
//   wordLength = 150,
  wordLength = 350,
  startPage = 1
) => {
  const textToks: string[][] = texts.map((t) => t.split(" ").filter(Boolean));
  const chunks: string[] = [];

  for (let idx = 0; idx < textToks.length; idx++) {
    const words = textToks[idx];
    for (let i = 0; i < words.length; i += wordLength) {
      let chunk: string | string[] = words.slice(i, i + wordLength);
      if (
        i + wordLength > words.length &&
        chunk.length < wordLength &&
        textToks.length !== idx + 1
      ) {
        textToks[idx + 1] = chunk.concat(textToks[idx + 1]);
        continue;
      }
      chunk = chunk.join(" ").trim();
      chunk = `[Page no. ${idx + startPage}] "${chunk}"`;
      chunks.push(chunk);
    }
  }

  return chunks;
};

// 1 prompt takes: 6.260 sec
// 2 prompt takes: 4.397 sec
// Prompt OpenAI takes: 10.658 sec