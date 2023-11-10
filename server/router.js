const router = require('express').Router();
const controller = require('./controllers/master');

// ROUTES FOR API INTERACTION
router.get('/api/create_link_token', controller.createLinkToken);

// ROUTES FOR APP INTERACTION
router.get('/logged_user', controller.loggedUser)
router.post('/register', controller.createUser)
router.post('/login', controller.login)
router.post('/logout', controller.logout)

router.get('*', (req, res) => {
  res
    .status(404)
    .send('Sorry, not found 😞');
});

module.exports = router;