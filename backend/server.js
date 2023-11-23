const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/ProductRoute');
const errorHandler = require('./middleware/errorMiddleware');
const app = express();
const dotenv = require('dotenv').config();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
);

// Routes
app.use('/api/v1/auth', userRoute);
app.use('/api/v1/products', productRoute);
app.get('/', (req, res) => {
  res.send('Chzzy-shop backend');
});

app.use(errorHandler);
const connectBackend = async () => {
  try {
    connectDB(process.env.MONGO_URI);

    app.listen(process.env.PORT, () =>
      console.log(`Sever connected on port ${process.env.PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
};
connectBackend();
