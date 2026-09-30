import Express from 'express'
import { login, register } from '../controller/user.Controller.js'
import { validateLogin, validateRegister } from '../validation/validateUser.js'

const router = Express.Router()

router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)

export default router