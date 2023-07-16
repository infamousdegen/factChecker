import fetch from "isomorphic-fetch";
import { HttpAgent } from "@dfinity/agent";
import { createActor } from "/home/metadev/Downloads/factpage/src/backend/declarations/message_board/index.js";
import { identity } from "./identity.js";
import fs from 'fs';

async function main() {
  const agent = new HttpAgent({
    identity: await identity,  
    host: "http://127.0.0.1:4943",
    fetch,
  });

  const actor = createActor("bkyz2-fmaaa-aaaaa-qaaaq-cai", {
    agent,
  });

  const gzipBuffer = fs.readFileSync('message_board.wasm.gz');
  const myArray = new Uint8Array(gzipBuffer);

  console.log(actor)
  console.log(await actor.newValue(myArray))
  console.log(await actor.deployCanister())



}

main().catch((error) => {
  console.log("err")
  console.error(error);
});







