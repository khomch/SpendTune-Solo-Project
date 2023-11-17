import { Response, Request, Router } from 'express';
import controller from './controllers/master';

const router = Router();

// ROUTES FOR API INTERACTION
router.get('/api/create_link_token', controller.createLinkToken);
router.post('/api/exchange_public_token', controller.exchangePublicToken);
router.post('/api/sync_transactions', controller.syncTransactions);

// ROUTES FOR CLIENT INTERACTION
router.get('/logged_user', controller.loggedUser);
router.post('/register', controller.createUser);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.post('/add_category', controller.addCategory);
router.post('/assign_category', controller.assignCategory);

router.get('*', (req:Request, res:Response) => {
  res.status(404).send('Sorry, not found 😞');
});

export default router;