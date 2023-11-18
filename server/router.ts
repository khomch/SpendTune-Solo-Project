import { Response, Request, Router } from 'express';
import controller from './controllers/master';
import userController from './controllers/user.controller';
import { auth } from './middlewares/auth';
import categoryController from './controllers/category.controller';

const router = Router();

// ROUTES FOR API INTERACTION
router.get('/api/create_link_token', controller.createLinkToken);
router.post('/api/exchange_public_token', controller.exchangePublicToken);
router.post('/api/sync_transactions', controller.syncTransactions);

// ROUTES FOR CLIENT INTERACTION
// router.get('/logged_user', controller.loggedUser);
router.post('/register', userController.createUser);
router.post('/login', userController.login);
router.post('/logout', auth, controller.logout);
router.post('/category/add', auth, categoryController.addCategory);
router.post('/category/assign', auth, categoryController.assignCategory);

router.get('*', (req: Request, res: Response) => {
  res.status(404).send('Sorry, not found 😞');
});

export default router;
