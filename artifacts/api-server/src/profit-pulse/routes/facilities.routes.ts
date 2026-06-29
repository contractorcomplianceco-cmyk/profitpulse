import { Router, type IRouter } from "express";
import {
  authenticateMock,
  getTenantContext,
  requireWriteAccess,
} from "../middleware/tenant";
import { mockFacilitiesRepository } from "../repositories/mock/facilities.mock";
import { paramId } from "../lib/params";

const router: IRouter = Router();

router.use(authenticateMock);

router.get("/", async (req, res, next) => {
  try {
    const rows = await mockFacilitiesRepository.list(getTenantContext(req));
    res.json({ data: rows });
  } catch (e) {
    next(e);
  }
});

router.post("/", requireWriteAccess, async (req, res, next) => {
  try {
    const row = await mockFacilitiesRepository.create(getTenantContext(req), req.body);
    res.status(201).json(row);
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", requireWriteAccess, async (req, res, next) => {
  try {
    const row = await mockFacilitiesRepository.update(getTenantContext(req), paramId(req.params.id), req.body);
    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(row);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", requireWriteAccess, async (req, res, next) => {
  try {
    const ok = await mockFacilitiesRepository.delete(getTenantContext(req), paramId(req.params.id));
    res.status(ok ? 204 : 404).send();
  } catch (e) {
    next(e);
  }
});

export default router;
