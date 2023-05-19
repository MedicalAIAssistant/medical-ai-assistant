import { NextResponse, NextRequest } from "next/server";
import { storage } from "@/app/storage/firebase";
import {
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { openAIRequest } from "@/app/storage/openai";

export const config = {
  api: {
    bodyParser: false,
  },
};

const mimetypeMapper: Record<string, string> = {
  ['text/plain']: '.txt'
};

const textToChunks = (
  texts: string[],
  // wordLength = 150,
  wordLength = 200,
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
}

export async function POST(req: NextRequest, res: NextResponse) {
  console.log("File uploading...");
  const query = new URLSearchParams(req.url).values().next().value;
  try {
    // Get file from request
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const fileToStorage = files[0];

    const filename = fileToStorage.name;
    // create ref for that file
    const fileRef = ref(storage, filename);

    const fileContent = await fileToStorage.text();

    const contents = textToChunks([fileContent]);

    let result;

    for (const chunk of contents) {
      const prompt = chunk + "\n\n" + query;
      result = await openAIRequest(prompt);
      console.log(result, 'result')
    }
    console.log(result, 'result after OPENAI request')
    const metadata = {
      // get mimetype of this file
      contentType: mimetypeMapper[fileToStorage.type]
    };
  
    if(!metadata.contentType) {
      throw new Error('No content type specified');
    }

    // pass ref and buffer
    const snapshot = await uploadBytesResumable(
      fileRef,
      await fileToStorage.arrayBuffer(),
      metadata
    );

    // const fileContent = await getFileContent(storage, snapshot.metadata.fullPath);
    // console.log(fileContent, "fileContent");
    return NextResponse.json({ data: result.data });
  } catch (err: any) {
    console.log(err.message, 'message');
    console.log(err.response?.data);
    return NextResponse.json({ data: [] });
  }
}
/*
 TODO:
 - refine text
 - how to choose from different answers correct one
*/

/**
 * General idea of asking question based on document
 * 
 * - upload pdf document from UI
 * - save pdf document on server
 * - parse pdf document to txt or plain text (if possible)
 * - read txt or get plain text
 * - refine text and remove unnecessary articles: the, a, an etc (to decrease words)
 * - split context into chunks to follow tokens limitation (4097 tokens per request)
 * - to each chunk add question: chunk + \n + question
 * - for each prompt make a an openai call
 * - get latest response and return it as BE response
 */