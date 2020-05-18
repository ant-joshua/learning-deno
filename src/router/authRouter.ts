import { Router } from "../../deps.ts";
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category_controller.ts";

const router = new Router();

router.get("/category", getCategories);
router.post("/category", createCategory);
router.get("/category/:id", getCategory);
router.put("/category/:id", updateCategory);
router.delete("/category/:id", deleteCategory);

export default router;
