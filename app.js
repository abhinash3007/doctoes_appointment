const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

const messageRoutes = require('./router/messageRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const { ErrorHandler } = errorMiddleware;
const userRouter=require("./router/userRouter");
const appointmentRouter=require("./router/appointmentRouter");
const app = express();

app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

app.use('/api/message', messageRoutes);
app.use('/api/user', userRouter);
app.use('/api/appointment', appointmentRouter);

app.use(errorMiddleware);

require('./config/mongoose-connection');

module.exports = app;
