const express = require("express");
const connectDB = require("./database");
const app = express();
const registrationRoutes = require("./routes/registerRoutes");
const followRoutes = require("./routes/followRoutes");
connectDB();

app.use(express.json());

app.use("/api/registration", registrationRoutes);
app.use("/api/user", followRoutes);

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
