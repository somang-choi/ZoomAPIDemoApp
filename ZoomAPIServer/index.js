process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const controller = require('./controllers/index');
const router = express.Router();

router.get('/', (req, res) => controller.getHome(req, res));
router.get('/createMeeting', (req, res) => controller.getCreateMeeting(req, res));
router.post('/createMeeting', (req, res) => controller.postCreateMeeting(req, res));

app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', router);
app.listen(4000);

console.log('Listening port 4000');
