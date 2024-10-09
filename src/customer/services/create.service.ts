import { DateTime } from "luxon";
import { OpenAPIRoute } from "chanfana";
import { Customer, CustomerSchema } from "../entities/customer.entity";
import { createSchemaValidator } from "../swagger/create.schema.validator";
import { customerStatus } from "../const/customer-status";
import { customerSubscriptionStatus } from "../const/customer-subscription-status";

export class CreateService extends OpenAPIRoute {
	schema = createSchemaValidator;
	async handle(context) {
		const result = CustomerSchema.safeParse(await context.req.json());
		if (!result.success) {
			return context.json({ success: false, error: 'Invalid customer data', details: result.error }, 400);
		}

		const newCustomer: Customer = {
			...result.data,
			status: customerStatus.ACTIVE,
			subscriptionStatus: customerSubscriptionStatus.ACTIVE,
			createdAt: DateTime.now().toISO(),
			updatedAt: DateTime.now().toISO(),
		};
		const customerData = CustomerSchema.parse(newCustomer);
		await context.env.CUSTOMER_KV.put(customerData.id, JSON.stringify(customerData));

		return context.json({
			success: true,
			result: {
				data: customerData
			}
		}, 201);
	}
}
