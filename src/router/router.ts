import { Router } from "https://deno.land/x/oak/mod.ts";
import { login, register, getAllUser } from "../controllers/auth_controller.ts";

const router = new Router();

router.post("/login", login);
router.post("/register", register);
router.get("/users", getAllUser);
export default router;
