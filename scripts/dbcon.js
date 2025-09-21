import { Client } from "pg";

const client = new Client({
  connectionString: "postgresql://martDB_owner:jJAlE86MbTwg@ep-muddy-math-a2ytlmdj-pooler.eu-central-1.aws.neon.tech/martDB?sslmode=require&connection_limit=10",
});

client.connect()
  .then(() => {
    console.log("Connected successfully!");
    client.end();
  })
  .catch(err => console.error("Connection failed:", err));
