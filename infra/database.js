import { Client } from "pg";

async function query(queryObject) {
  let client;
  let result;

  try {
    client = await getNewClient();
    result = await client.query(queryObject);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }

  return result;
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.NODE_ENV == "production" ? true : false,
  });

  await client.connect();
  return client;
}

const database = {
  query,
  getNewClient,
};

export default database;
