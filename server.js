const express = require('express');
const app = express();
const dotenv=require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const {connection}=require("./config/db");
const cors = require('cors');
const cookieParser=require("cookie-parser")
connection();

// app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json());
app.use(express.json());
app.set('view engine', 'ejs');
app.use(cookieParser())
// test api
app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.use('/api/auth', require('./routes/auth'));
app.use('/api/password-reset', require('./routes/passwordReset'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}
);