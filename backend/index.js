const express = require('express');
const app = express();
const cors = require("cors");
require("./db/config");
const User = require("./db/User");
app.use(express.json());
app.use(cors());

const pinRoute = require('./routes/pins')
const userRoute = require('./routes/users')

app.use("/api/pins",pinRoute);
app.use("/api/users",userRoute);

app.listen(8000);