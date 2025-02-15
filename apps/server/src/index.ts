/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import {  createConnectRouter, createContextValues } from "@connectrpc/connect";
import { routes } from "./routes";
import { kStore } from "./store-context";
import { Hono } from "hono";
import { cors } from 'hono/cors'
import {  showRoutes } from 'hono/dev'
import {
  UniversalHandler,
  universalServerRequestFromFetch,
  universalServerResponseToFetch,
} from "@connectrpc/connect/protocol";

type Environment = {
  STORE: KVNamespace;
};


const app = new Hono<{
  Bindings: Environment;
}>();

app.use('/*', cors())

const router = createConnectRouter();
routes(router);

const paths = new Map<string, UniversalHandler>();
for (const uHandler of router.handlers) {
  paths.set(uHandler.requestPath, uHandler);
  console.log(`Registered route: ${uHandler.requestPath}`);
}

for (const [path, handler] of paths) {
	app.post(path, async (c) => {
		const uReq = {
		  ...universalServerRequestFromFetch(c.req.raw, {}),
		  contextValues: createContextValues().set(kStore, c.env.STORE),
		};
		const uRes = await handler(uReq);
		return universalServerResponseToFetch(uRes);
	  });

}

app.get("/", async (c) => {
	  return c.text("I love OpenStatus");
});

showRoutes(app, {
	verbose: true,
  })

  export default app