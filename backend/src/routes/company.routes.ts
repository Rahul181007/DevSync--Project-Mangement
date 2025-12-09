import { Router } from "express";
import { authMiddleware } from "middleware/authMiddleware";
import { roleMiddleware } from "middleware/roleMiddleware";
import { companyController } from "modules/company/company.controller";

const router=Router();

// Super admin only routes

router.get(
    '/superadmin/companies',
    authMiddleware,
    roleMiddleware('SUPER_ADMIN'),
    companyController.listCompanies
);

router.post(
    '/superadmin/companies',
    authMiddleware,
    roleMiddleware('SUPER_ADMIN'),
    companyController.createCompany
)

router.patch(
 "/superadmin/companies/:id/status",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN"),
  companyController.updateStatus
)

export default router