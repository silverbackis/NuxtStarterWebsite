import { Router } from 'express'
import auth from './auth'
const router = Router()

// Add AUTH Routes
router.use(auth)

export default router
