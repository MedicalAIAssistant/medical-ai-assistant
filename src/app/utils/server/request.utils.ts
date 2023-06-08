
import { NextRequest } from "next/server";

// Get file from request
export const getFileFromRequest = async (req: NextRequest) => {
  const formData = await req.formData();
  const files = formData.getAll("files") as File[];
  const fileToStorage = files[0];

  return fileToStorage;
};

// Get query param
// TODO should be easier way of doing this
export const getQueryParamFromRequest = (req: NextRequest) => {
    return new URLSearchParams(req.url).values().next().value;
};