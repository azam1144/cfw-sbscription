import { fromHono } from "chanfana";
import { Hono } from "hono";

import { CreateService as SubscriptionCreateService } from "./subscription/services/create.service";
import { DeleteService as SubscriptionDeleteService } from "./subscription/services/delete.service";
import { UpdateService as SubscriptionUpdateService } from "./subscription/services/update.service";
import { ListService as SubscriptionListService } from "./subscription/services/list.service";
import { OneService as SubscriptionOneService } from "./subscription/services/one.service";

import { CreateService as CustomerCreateService } from "./customer/services/create.service";
import { DeleteService as CustomerDeleteService } from "./customer/services/delete.service";
import { UpdateService as CustomerUpdateService } from "./customer/services/update.service";
import { ListService as CustomerListService } from "./customer/services/list.service";
import { OneService as CustomerOneService } from "./customer/services/one.service";
import { ListByPlanService } from "./subscription/services/list.plan.service";
import { AssociateService } from "./customer/services/associate.service";
import { CronGenerateInvoice } from "./customer/services/cron-generate-invoice";
import { ChangeSubscriptionStatusService } from "./customer/services/change-subscription-status.service";
import { ChangeSubscriptionPlanService } from "./customer/services/change-subscription-plan.service";
import { StaticTypesService } from "./subscription/services/static-types.service";

const app = new Hono();
const openapi = fromHono(app, {
	docs_url: "/",
});

openapi.get("/api/v0.1/subscription/static-enums", StaticTypesService);
openapi.get("/api/v0.1/subscription", SubscriptionListService);
openapi.post("/api/v0.1/subscription", SubscriptionCreateService);
openapi.get("/api/v0.1/subscription/one/:id", SubscriptionOneService);
openapi.patch("/api/v0.1/subscription/:id", SubscriptionUpdateService);
openapi.delete("/api/v0.1/subscription/:id", SubscriptionDeleteService);
openapi.get("/api/v0.1/subscription/:planId/customers", ListByPlanService);

openapi.get("/api/v0.1/customer", CustomerListService);
openapi.get("/api/v0.1/customer/one/:id", CustomerOneService);
openapi.post("/api/v0.1/customer", CustomerCreateService);
openapi.patch("/api/v0.1/customer/:id", CustomerUpdateService);
openapi.delete("/api/v0.1/customer/:id", CustomerDeleteService);
openapi.post("/api/v0.1/customer/:customerId/subscribe/plan/:planId", AssociateService);
openapi.post("/api/v0.1/customer/:customerId/change/plan/:planId", ChangeSubscriptionPlanService);
openapi.post("/api/v0.1/customer/:customerId/plan/change-status", ChangeSubscriptionStatusService);

openapi.get("/api/v0.1/customer/invoice/generate_batch", CronGenerateInvoice);

export async function scheduled(event: ScheduledEvent) {
	console.log('scheduled:');
	// await CronGenerateInvoice(event);
}

export default app;
