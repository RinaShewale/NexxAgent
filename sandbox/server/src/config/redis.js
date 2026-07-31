import "dotenv/config";
import { Redis } from "ioredis";

import { deletePod } from "../kubernetes/pod.js";
import { deleteService } from "../kubernetes/service.js";

const redis = new Redis(process.env.REDIS_URL);
const subscribe = new Redis(process.env.REDIS_URL);


// Redis connection logs
redis.on("connect", () => {
  console.log("🔌 Redis connection established");
});

redis.on("ready", () => {
  console.log("✅ Redis is ready to use");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err.message);
});

redis.on("reconnecting", () => {
  console.log("🔄 Redis reconnecting...");
});


// Subscriber Redis logs
subscribe.on("connect", () => {
  console.log("🔌 Redis subscriber connected");
});

subscribe.on("ready", () => {
  console.log("✅ Redis subscriber ready");
});

subscribe.on("error", (err) => {
  console.error("❌ Redis subscriber error:", err.message);
});


// Create sandbox key with 2-minute expiry
export async function createSandboxKey(sandboxId) {
  await redis.set(
    `sandbox:${sandboxId}`,
    JSON.stringify({
      status: "active",
    }),
    "EX",
    120
  );
}


// Enable keyspace notifications
await subscribe.config(
  "SET",
  "notify-keyspace-events",
  "Ex"
);


// Subscribe expired events
await subscribe.subscribe("__keyevent@0__:expired");


subscribe.on("message", async (channel, key) => {

  console.log(`Key expired: ${key}`);

  if (!key.startsWith("sandbox:")) return;

  const sandboxId = key.split(":")[1];

  console.log("Expired Sandbox ID:", sandboxId);


  try {

    await Promise.all([
      deletePod(sandboxId),
      deleteService(sandboxId),
    ]);

    console.log(
      `🗑️ Sandbox ${sandboxId} resources deleted`
    );

  } catch (error) {

    console.error(
      "Cleanup failed:",
      error.message
    );

  }

});


export { redis, subscribe };