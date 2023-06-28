"use client";
import { useState } from "react";
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
export default function Fetcher() {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [question, setQuestion] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const onSearch = () => {
    const formData = new FormData();
    formData.append("files", file!);
    setLoading(true);
    setMessages((prev) =>
      question ? [...prev, { message: question, sender: "user" }] : prev
    );
    setQuestion("");

    fetch(`/api/chat?query=${question}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then(({ data }) => {
        setLoading(false);
        setMessages((prev) => {
          const messages = (data?.choices || []).map(({ text }: any) => ({
            sender: "ai",
            message: text,
          }));
          return [...prev, ...messages];
        });
      })
      .catch(() => {
        setLoading(false);
        setMessages((prev) => [...prev, errorMessage]);
      });
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
          {messages.map(({ message, sender }) => (
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
            </Box>
          ))}
        </Box>

        {loading && <p>Loading...</p>}
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
