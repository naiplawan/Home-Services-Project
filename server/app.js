import express from 'express';
import authRouter from './apps/auth.js';

async function init() {
  const app = express();
  const port = 4000;

  app.use("/auth", authRouter)

  app.get("/", (req, res) => {
    res.send("Welcome to Home Service!");
  });

  app.get("*", (req, res) => {
    res.status(404).send("Page Not Found");
  });

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

init();