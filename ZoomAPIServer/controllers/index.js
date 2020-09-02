require('dotenv').config()

const axios = require('axios').default;
const loginUrl = 'https://zoom.us/oauth/authorize?response_type=code&client_id=' + process.env.CLIENT_ID + '&redirect_uri=' + process.env.REDIRECT_URL;

module.exports.getHome = (req, res) => {
  if (req.query.code) {
    let url = `https://zoom.us/oauth/token?grant_type=authorization_code&code=${req.query.code}&redirect_uri=${process.env.REDIRECT_URL}`;
    let config = {
      auth: {
        username: process.env.CLIENT_ID,
        password: process.env.CLIENT_SECRET
      }
    };

    axios
      .post(url, {}, config)
      .then((response) => {
        let data = response.data
        if (data.access_token) {
          process.env.ACCESS_TOKEN = data.access_token;
          process.env.REFRESH_TOKEN = data.refresh_token;
          process.env.EXPIRES_IN = data.expires_in;
          res.render('addMeeting', { title: 'Manage Meetings' });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    res.redirect(loginUrl);
  }
}

module.exports.getCreateMeeting = (req, res) => res.render('addMeeting');

module.exports.postCreateMeeting = (req, res) => {
  let url = `https://api.zoom.us/v2/users/${req.body.id}/meetings`;
  let config = {
    headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
    body: {
      topic: req.body.topic,
      type: 2,
      password: req.body.pw,
    }
  };

  axios
    .post(url, {}, config)
    .then((response) => {
      let data = response.data;
      console.log(data)
      res.render('joinMeeting', { meeting: data });
    })
    .catch((error) => {
      console.error(error);
    })
}
