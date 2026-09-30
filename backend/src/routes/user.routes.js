import Express from 'express'
import { login, register } from '../controller/user.Controller'

const router = Express.Router()

router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)