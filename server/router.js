const router = require('express').Router();
const controller = require('./controllers/master');

router.get('*', (req, res) => {
  res
    .status(404)
    .send('Sorry, not found 😞');
});

// ROUTES FOR API INTERACTION
router.post('/getLinkToken', controller.getLinkToken);

// ROUTES FOR APP INTERACTION
router.post('/register', controller.createUser)

module.exports = router;