const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const tableRouter = require("./routers/table");
const processusRouter = require("./routers/processus");
const domaineRouter = require("./routers/domaine");
const app = express();
const port = process.env.PORT;

// Create express server

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");

  // authorized headers for preflight requests
  // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();

  app.options("*", (req, res) => {
    // allowed XHR methods
    res.header(
      "Access-Control-Allow-Methods",
      "GET, PATCH, PUT, POST, DELETE, OPTIONS"
    );
    res.send();
  });
});

app.use(express.json());
app.use(userRouter);
app.use(tableRouter);
app.use(processusRouter);
app.use(domaineRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
