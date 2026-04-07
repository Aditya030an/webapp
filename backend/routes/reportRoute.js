import express from 'express';
import { createBill, createExpenses , createInventory , createRent ,createSalary , getBill , getExpenses , getInventory , getRent , getSalary, updateBillPaymentStatus, updateRentStatus, updateSalaryPaidStatus} from '../controllers/reportsController.js';

const reportRouter = express.Router();

reportRouter.post("/bill" , createBill);
reportRouter.post("/expenses" , createExpenses);
reportRouter.post("/inventory" , createInventory);
reportRouter.post("/rent" , createRent);
reportRouter.post("/salary" , createSalary);

reportRouter.get("/bill" , getBill);
reportRouter.get("/expenses" , getExpenses);    
reportRouter.get("/inventory" , getInventory);
reportRouter.get("/rent" , getRent);
reportRouter.get("/salary" , getSalary);

reportRouter.put("/rent/:id" , updateRentStatus);
reportRouter.put("/salary/:entryId/:empId", updateSalaryPaidStatus);
reportRouter.put("/bill/:id", updateBillPaymentStatus);

export default reportRouter;