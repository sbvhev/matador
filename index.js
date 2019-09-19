import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import querystring from 'querystring';
import _ from 'lodash';
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/api/unsubscribe', (req, res) => {
  const options = {
    method: 'DELETE',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data: querystring.stringify({
      emails: req.query.email,
      api_key: process.env.api_key,
    }),
    url: `https://a.klaviyo.com/api/v2/list/${process.env.list_id}/subscribe`,
    timeout: 3000,
  };
  try {
    axios(options);
  } catch (err) {
    console.log(err.response);
  }
});

app.get('/api/check', async (req, res) => {
  const options = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
    data: {},
    url: `https://a.klaviyo.com/api/v2/group/${process.env.list_id}/members/all?api_key=${process.env.api_key}`,
  };
  try {
    const { data: { records } = {} } = await axios(options);
    const isChecked = !!_.find(records, { email: req.query.email });
    res.json({ check: isChecked });
  } catch (err) {
    res.status(406).end();
  }
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
