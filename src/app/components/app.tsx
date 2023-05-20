"use client";
import { useState } from "react";
import { SearchInput } from "./search";
import { Box, Button } from "@mui/material";

type Message = {
  sender: string;
  message: string;
};

// test commit

export default function Fetcher() {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [value, setValue] = useState<string>(
    "основуючись на даному тексті, як звати головного персонажа та скільки йому років?"
  );
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const onSearch = () => {
    const formData = new FormData();
    formData.append("files", file!);
    setLoading(true);
    setMessages((prev) =>
      value ? [...prev, { message: value, sender: "user" }] : prev
    );
    setValue("");
    console.log(file, "file", formData, "onSearch");

    fetch(`/api/chat?query=${value}`, {
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
      });
  };

  const onClear = () => {
    setMessages([]);
  };

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
          {(messages || []).map(({ message, sender }) => (
            <Box
              key={message}
              width="50%"
              sx={{
                color: sender === "user" ? "#B4B3B2" : "white",
                textAlign: sender === "user" ? "end" : "start",
                marginLeft: sender === "user" ? "50%" : "12px",
                marginRight: sender === "ai" ? "50%" : "12px",
                fontSize: "20px",
              }}
            >
              {message}
            </Box>
          ))}
        </Box>

        {loading && <p>Loading...</p>}
      </Box>
      <SearchInput
        value={value}
        setValue={setValue}
        onSearch={onSearch}
        onClear={onClear}
        onUpload={setFile}
      />
    </>
  );
}
