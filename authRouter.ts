import { Router }from 'https://deno.land/x/oak/mod.ts'
import { createCategory, getCategories, fetchOneCategory, updateCategory, deleteCategory } from './src/controllers/categories.ts'

const router = new Router()

router.get('/category',getCategories)
router.post('/category',createCategory)
router.get('/category/:id',fetchOneCategory)
router.put('/category/:id',updateCategory)
router.delete('/category/:id',deleteCategory)


export default router;