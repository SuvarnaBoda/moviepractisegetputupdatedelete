const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.use = express.json();
let db = null;
const path = require("path");
const dbpath = path.join(__dirname, "moviesData.db");
const initialiseDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
  } catch (e) {
    console.log(`DB ERROR ${e.message}`);
  }
  app.listen(3000, () => {
    console.log("Server is running");
  });
};
initialiseDBAndServer();

app.get("/movies/", async (request, response) => {
  const listquery = `
            SELECT * FROM movie ORDER BY movie_id; 
    `;
  const movieslist = await db.all(listquery);
  response.send(movieslist);
});

app.post("/movies/", async (request, response) => {
  const moviedetails = request.body;
  const { director_id, movie_name, lead_actor } = moviedetails;
  const postquery = `
        INSERT INTO movie (director_id,
movie_name,
lead_actor) VALUES (${director_id},
${movie_name},
${lead_actor});
    `;
  const postresponse = await db.run(postquery);
  const movieId = postresponse.lastID;
  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getonemmoviequery = `
        SELECT * FROM movie ORDER BY movie_id WHERE movie_id=${movieId};
    `;
  const oneresult = await db.get(getonemmoviequery);
  response.send(oneresult);
});

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const moviedetails = request.body;
  const putquery = `
        UPDATE movie SET 
  directorId='${directorId}' ,
  movieName='${movieName}',
  leadActor='${leadActor}' WHERE movie_id=${movieId};
    `;
  const putresponse = await db.run(putquery);
  response.send("Movie Details Updated");
});

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deletequery = `
            DELETE FROM movie WHERE movie_id=${movieId};
        `;
  const deleteresponse = await db.run(deletequery);
  response.send("Movie Removed");
});
module.exports = app;
