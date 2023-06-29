import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import { OpenAIStream, StreamingTextResponse } from "ai";

// https://levelup.gitconnected.com/how-to-stream-real-time-openai-api-responses-next-js-13-2-gpt-3-5-turbo-and-edge-functions-378fea4dadbd
/**
 * @deprecated We no longer use it as we have OpenAIStream from "ai"
 */
export class StreamServiceOld {
  createStream = (res: Response) => {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let counter = 0;

    const stream = new ReadableStream({
      async start(controller) {
        function onParse(event: ParsedEvent | ReconnectInterval) {
          if (event.type === "event") {
            const data = event.data;
            // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const text = json.choices[0].delta?.content || "";
              if (counter < 2 && (text.match(/\n/) || []).length) {
                // this is a prefix character (i.e., "\n\n"), do nothing
                return;
              }
              const queue = encoder.encode(text);
              controller.enqueue(queue);
              counter++;
            } catch (e) {
              controller.error(e);
            }
          }
        }

        // stream response (SSE) from OpenAI may be fragmented into multiple chunks
        // this ensures we properly read chunks and invoke an event for each SSE event stream
        const parser = createParser(onParse);
        // https://web.dev/streams/#asynchronous-iteration
        for await (const chunk of res.body as any) {
          parser.feed(decoder.decode(chunk));
        }
      },
    });

    return stream;
  };
}

export class StreamService {
  createStream = (response: Response) => {
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  }
}