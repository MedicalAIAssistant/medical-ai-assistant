"use client";
import { useState, useTransition } from "react";
import { SearchInput } from "./search";
import { Box } from "@mui/material";

type Message = {
  sender: string;
  message: string;
};
const errorMessage = {
  sender: "ai",
  message:
    "Упс... сталась якась помилка, спробуй будь ласка перефразувати питання.",
};
export default function Home() {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [isPending, startTransition] = useTransition();
  const [question, setQuestion] = useState<string>("");
  const [file, setFile] = useState(null);

  const onSearch = async () => {
    const formData = new FormData();
    formData.append("files", file!);
    setMessages((prev) =>
      question ? [...prev, { message: question, sender: "user" }] : prev
    );

    try {
      const response = await fetch(`/api/chat?query=${question}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      // This data is a ReadableStream
      const data = response.body;
      if (!data) {
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;
      setMessages((prev) => [...prev, { sender: "ai", message: "" }]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        startTransition(() => {
          setMessages((prev) => {
              const { message: lastMessage } = prev[prev.length - 1];
              prev[prev.length - 1].message = lastMessage + chunkValue;
              return prev;
          });
        });
      }
    } catch (e) {
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const onClear = () => setMessages([]);

  return (
    <>
      <Box
        sx={{
          alignItems: "center",
          height: "100%",
          minHeight: "100%",
          display: "block",
        }}
      >
        <Box>
          {messages.map(({ message, sender }, index) => (
            <Box
              key={message}
              width="45%"
              sx={{
                marginTop: "5px",
                color: sender === "user" ? "#B4B3B2" : "white",
                textAlign: sender === "user" ? "end" : "start",
                marginLeft: sender === "user" ? "54%" : "12px",
                fontSize: "20px",
                border: `1px solid ${sender === "user" ? "white" : "green"}`,
                padding: "10px",
                borderRadius: "20px",
              }}
            >
              {message}
              {/* When streaming response add kinda loading ... */}
              { index === messages.length - 1 && isPending && "..."}
            </Box>
          ))}
        </Box>
      </Box>
      <SearchInput
        value={question}
        setValue={setQuestion}
        onSearch={onSearch}
        onClear={onClear}
        onUpload={setFile}
      />
    </>
  );
}
