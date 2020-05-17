import { Router }from 'https://deno.land/x/oak/mod.ts'
import { login, coba_masuk, register, getAllUser } from './src/controllers/auth_controller.ts'

const router = new Router()


router.post('/login',login)
router.post('/register',register)
router.get('/coba',coba_masuk)
router.get('/users',getAllUser)
export default router;