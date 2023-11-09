const router = require('express').Router();
const controller = require('./controllers/master');


// ROUTES FOR API INTERACTION
router.get('/api/create_link_token', controller.createLinkToken);

// ROUTES FOR APP INTERACTION
router.get('/loggedUser', controller.loggedUser)
router.post('/register', controller.createUser)
router.post('/login', controller.login)

router.get('*', (req, res) => {
  res
    .status(404)
    .send('Sorry, not found 😞');
});

module.exports = router;