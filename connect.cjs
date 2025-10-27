const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });

async function main() {
  const Db = process.env.ATLAS_URI;
  const client = new MongoClient(Db);

  try {
    await client.connect();
    console.log(" Connected to MongoDB Atlas");

    const collections = await client.db("CompanyNameDB").collections();
    collections.forEach((col) => console.log(col.namespace));
  } catch (e) {
    console.error(" Connection failed:", e);
  } finally {
    await client.close();
  }
}

main();
