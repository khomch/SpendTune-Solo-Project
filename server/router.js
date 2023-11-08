const router = require('express').Router();
const userController = require('./controllers/user');

router.get('*', (req, res) => {
  res.status(404).send('Sorry, not found 😞');
});



module.exports = router;