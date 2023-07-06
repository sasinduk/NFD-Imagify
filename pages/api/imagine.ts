// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Midjourney } from "midjourney";
import { ResponseError } from "../../interfaces";
export const config = {
  runtime: "edge",
};

const handler = async (req: Request) => {
  const { prompt } = await req.json();

  console.log("imagine.handler", prompt);
  const client = new Midjourney({
    ServerId: '1118597018978361455',//<string>process.env.SERVER_ID,
    ChannelId: '1118597019683012660',//<string>process.env.CHANNEL_ID,
    SalaiToken: 'NjYzNzM4MzcwMjA3MjUyNTMw.G5ozg1.nYEanrSNHyiSR37BlBOHLCbq8MssUCRPsSKLdY',//<string>process.env.SALAI_TOKEN,
    HuggingFaceToken: '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',//<string>process.env.HUGGINGFACE_TOKEN,
    Debug: true,
    Ws: false,//process.env.WS === "true",
  });
  await client.init();
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    start(controller) {
      console.log("imagine.start", prompt);
      client
        .Imagine(prompt, (uri: string, progress: string) => {
          console.log("imagine.loading", uri);
          controller.enqueue(encoder.encode(JSON.stringify({ uri, progress })));
        })
        .then((msg) => {
          console.log("imagine.done", msg);
          controller.enqueue(encoder.encode(JSON.stringify(msg)));
          client.Close();
          controller.close();
        })
        .catch((err: ResponseError) => {
          console.log("imagine.error", err);
          client.Close();
          controller.close();
        });
    },
  });
  return new Response(readable, {});
};
export default handler;
