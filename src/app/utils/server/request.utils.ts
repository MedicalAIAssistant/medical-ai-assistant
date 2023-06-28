import { textToChunks } from "@/app/service/text-chunks.service";
import { NextRequest } from "next/server";

// Get file from request
export const getFileFromRequest = async (req: NextRequest) => {
  const formData = await req.formData();
  const files = formData.getAll("files") as File[];
  const fileToStorage = files[0];

  return fileToStorage;
};

// Get query param
export const getQueryParam = (req: NextRequest, key: string): string => {
  const { searchParams } = new URL(req.url);
  const param = searchParams.get(key);
  return param || "";
};

export const getFileContentChunks = async (req: NextRequest) => {
  const fileToStorage = await getFileFromRequest(req);
  // In case user does not pass document, no chunks
  if (!fileToStorage.name) {
    return [];
  }
  const fileContent = await fileToStorage.text();
  const contents = textToChunks([fileContent]);
  return contents;
};
