const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { getClubList, addFeedback, addEvent } = require('./database');

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    console.log(req.query);
    res.send('hello!');
});

app.get('/clubs', async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    const clubs = await getClubList();
    res.send(clubs);
});

app.post('/feedback', async (req, res, next) => {
    if (req.body.feedback == '') {
        res.sendStatus(400);
        return;
    }
    addFeedback(req.body.feedback);
    res.sendStatus(200);
});

app.post('/add-event', async (req, res, next) => {
    var blank = false;
    Object.values(req.body).forEach((val) => {
        if (val == '') blank = true;
    });
    if (blank) {
        res.sendStatus(400);
        return;
    }
    addEvent(req.body);
    res.sendStatus(200);
});

app.listen(process.env.PORT | 5000, () => console.log(`Listening on port ${process.env.PORT | 5000}`));
