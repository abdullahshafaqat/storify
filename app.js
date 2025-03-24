const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const indexRoutes = require('./routes/index.routes');
const connectToDB = require('./config/db');
const fileRoutes = require('./routes/file.routes');
// Load environment variables first
dotenv.config();

const app = express();
connectToDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use('/user', userRoutes);
app.use('/user', fileRoutes);
app.use('/', indexRoutes);
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

