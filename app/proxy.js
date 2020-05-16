const request = require('request');
const router = require('express').Router();

const config = require(`./config/${process.env.NODE_ENV}.config`);

router.get('/image', (req, res) => {
  const lat = req.query.lat || 30.30;
  const lng = req.query.lng || 30.30;
  const zoom = req.query.zoom || 5;
  console.log(config.maps.apiKey);
  request(`https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
  &markers=color:red%7Clabel:Place%7C${lat},${lng}
  &key=${config.maps.apiKey}`, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log(body.explanation);
  }).pipe(res);
});

router.get('/address', (req, res) => {
  const lat = req.query.lat;
  const lng = req.query.lng;

  request(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${config.maps.apiKey}`, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log(body.explanation);
  }).pipe(res);

});

module.exports = router;
