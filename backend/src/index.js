/* eslint camelcase: 0 */const express = require('express');
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

// TODO: Get these from .env
const CLIENT_ID = '922ce59a255246b1a201c00ceea1018c';
const CLIENT_SECRET = 'f61624ec785049b18d7b24d224f596a1';
const CALLBACK_URL = 'http://localhost:8888/callback/';
const WEB_HOST_URL = 'http://localhost:8080';

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

const app = express();

app.use(express.static(`${__dirname}/public`))
  .use(cors())
  .use(cookieParser());

app.options('*', cors());

app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  const scope = 'user-read-private user-read-email';
  res.redirect(`https://accounts.spotify.com/authorize?${
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope,
      redirect_uri: CALLBACK_URL,
      state,
    })}`);
});

app.get('/callback', (req, res) => {
  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(`/#${
      querystring.stringify({
        error: 'state_mismatch',
      })}`);
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code,
        redirect_uri: CALLBACK_URL,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
      json: true,
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const { access_token, refresh_token } = body;

        res.redirect(`${WEB_HOST_URL}/#${
          querystring.stringify({
            access_token,
            refresh_token,
          })}`);
      } else {
        res.redirect(`/#${
          querystring.stringify({
            error: 'invalid_token',
          })}`);
      }
    });
  }
});

app.get('/refresh_token', (req, res) => {
  // requesting access token from refresh token
  const { refresh_token } = req.query;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}` },
    form: {
      grant_type: 'refresh_token',
      refresh_token,
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const { access_token } = body;
      res.send({
        access_token,
      });
    }
  });
});

console.log('Listening on 8888');
app.listen(8888);
