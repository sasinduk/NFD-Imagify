// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Midjourney } from "midjourney";
import { ResponseError } from "../../interfaces";
export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const { content, index, msgId, msgHash } = await req.json();
  console.log("upscale.handler", content);
  const client = new Midjourney({
    ServerId: '1118597018978361455',//<string>process.env.SERVER_ID,
    ChannelId: '1118597019683012660',//<string>process.env.CHANNEL_ID,
    SalaiToken: 'NjYzNzM4MzcwMjA3MjUyNTMw.GuNQtK.8dno2wVuA_fgEqD_KaWPBGmO4QyU1zPvBO1N-o',//<string>process.env.SALAI_TOKEN,
    HuggingFaceToken: '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',//<string>process.env.HUGGINGFACE_TOKEN,
    Debug: true,
    Ws: false,//process.env.WS === "true",
  });
  await client.init();
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    start(controller) {
      console.log("upscale.start", content);
      client
        .Upscale(
          content,
          index,
          msgId,
          msgHash,
          (uri: string, progress: string) => {
            console.log("upscale.loading", uri);
            controller.enqueue(
              encoder.encode(JSON.stringify({ uri, progress }))
            );
          }
        )
        .then((msg) => {
          console.log("upscale.done", msg);
          controller.enqueue(encoder.encode(JSON.stringify(msg)));
          client.Close();
          controller.close();
        })
        .catch((err: ResponseError) => {
          console.log("upscale.error", err);
          client.Close();
          controller.close();
        });
    },
  });
  return new Response(readable, {});
}
