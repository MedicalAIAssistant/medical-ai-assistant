import { NextResponse, NextRequest } from "next/server";
import { trackTimeWrapper } from "@/app/utils/track-time-wrapper";
import {
  getQueryParam,
  getFileContentChunks,
} from "@/app/utils/server/request.utils";
import { prompt } from "@/app/storage/openai/utils";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const query = getQueryParam(req, "query");
    const contents = await getFileContentChunks(req);

    const result = await trackTimeWrapper(
      () => prompt(contents, query),
      "Prompt OpenAI"
    );

    // Create separate endpoint to manage file upload
    // const snapshot = await trackTimeWrapper(
    //   () => uploadFile(fileToStorage),
    //   "Uploading file to firebase"
    // );
    // const fileContent = await getFileContent(storage, snapshot.metadata.fullPath);
    // console.log(fileContent, "fileContent");

    return NextResponse.json({ data: result.data });
  } catch (err: any) {
    console.log(err.message, "message");
    console.log(err.response?.data);
    return NextResponse.json({ data: [] });
  }
}
/*
 TODO:
 - refine text to remove new lines, articles, redundant words
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
