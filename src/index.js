const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const tableRouter = require("./routers/table");
const processusRouter = require("./routers/processus");
const domaineRouter = require("./routers/domaine");
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(tableRouter);
app.use(processusRouter);
app.use(domaineRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
