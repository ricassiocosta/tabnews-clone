import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const dbVersion = await database.query("SHOW server_version;");
  const dbVersionValue = dbVersion.rows[0].server_version;

  const dbMaxConns = await database.query("SHOW max_connections;");
  const dbMaxConnsValue = parseInt(dbMaxConns.rows[0].max_connections);

  const databaseName = process.env.POSTGRES_DB;
  const dbOpenConns = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const dbOpenConnsValue = dbOpenConns.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dbVersionValue,
        max_connections: dbMaxConnsValue,
        open_connections: dbOpenConnsValue,
      },
    },
  });
}

export default status;
