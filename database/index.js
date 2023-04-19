const neo4j = require("neo4j-driver");

const driver = neo4j.driver(
  process.env.DB_URI,
  neo4j.auth.basic(process.env.DB_USER, process.env.DB_PWD)
);

driver
  .verifyConnectivity()
  .then(() => {
    console.log("Successfully connected to Neo4j database!");
  })
  .catch((error) => {
    console.error("Error connecting to Neo4j database:", error);
    driver.close();
  });

module.exports = driver;
