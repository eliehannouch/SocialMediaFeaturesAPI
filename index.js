const express = require("express");
const connectDB = require("./database");
const app = express();
const registrationRoutes = require("./routes/registerRoutes");
const followRoutes = require("./routes/followRoutes");
const requestRoutes = require("./routes/requestRoutes");
connectDB();

app.use(express.json());

app.use("/api/registration", registrationRoutes);
app.use("/api/user", followRoutes);
app.use("/api/users", requestRoutes);

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
