const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "cricketTeam.db");
const app = express();
app.use(express.json());
let db = null;

const initilizeDatabaseAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("the server running at http://localhost:3000");
    });
  } catch (error) {
    console.log(`database error:${error.message}`);
    process.exit(1);
  }
};

initilizeDatabaseAndServer();

//Get All Players
app.get("/players/", async (request, response) => {
  const getAllPlayersQuery = `
    SELECT
     * 
    FROM
    cricket_team
    ORDER BY player_id;`;
  const playersArray = await db.all(getAllPlayersQuery);
  response.send(playersArray);
});

//Create a Player
app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const createPlayerQuery = `
    INSERT INTO 
    cricket_team(playerName,jerseyNumber,role)
    VALUES
    (${playerName},${jerseyNumber},${role})
    `;
  const player = await db.run(createPlayerQuery);
  response.send("Player Added to Team");
});
