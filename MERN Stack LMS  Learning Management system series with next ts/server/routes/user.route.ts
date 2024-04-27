import express from 'express';
import { registrationUser, loginUser, logoutUser,getUserInfo} from '../controllers/user.controllers';


const router = express.Router();

router.post("/registrationUser", registrationUser);
router.post("/loginUser", loginUser);
router.get('/me', getUserInfo);
router.get('/logout',logoutUser)

export default router