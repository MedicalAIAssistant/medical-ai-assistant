import { FirebaseStorage, getDownloadURL, listAll, ref, uploadBytesResumable} from "firebase/storage";
import { storage } from ".";

export const getAllFiles = async (storage: FirebaseStorage) => {
  const listRef = ref(storage);
  const { items } = await listAll(listRef);

  return items;
};

export const getFileContent = async (storage: FirebaseStorage, fullPath: string) => {
  const downloadUrl = await getDownloadURL(ref(storage, fullPath));
  const file = await fetch(downloadUrl);
  const fileContent = await file.text();

  return fileContent;
};

// Expand for PDF
const mimetypeMapper: Record<string, string> = {
  ["text/plain"]: ".txt",
};

export const uploadFile = async (fileToStorage: File) => {
  const filename = fileToStorage.name;
  // create ref for that file
  const fileRef = ref(storage, filename);
  const metadata = {
    // get mimetype of this file
    contentType: mimetypeMapper[fileToStorage.type],
  };

  if (!metadata.contentType) {
    throw new Error("No content type specified");
  }

  // pass ref and buffer
  const snapshot = await uploadBytesResumable(
    fileRef,
    await fileToStorage.arrayBuffer(),
    metadata
  );
  return snapshot;
};
