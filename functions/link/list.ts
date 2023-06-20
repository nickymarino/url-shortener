import { list } from "@/functions/core/entities/link";
import { ApiHandler } from "sst/node/api";

export const handler = ApiHandler(async (_evt) => {
  const result = await list();
  return {
    body: JSON.stringify({
      links: result,
    }),
  };
});
