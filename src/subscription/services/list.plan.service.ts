import { Context } from 'hono';
import { OpenAPIRoute } from "chanfana";
import { getPage, pagination } from "../../core/utils";
import { Customer } from "../../customer/entities/customer.entity";
import { listByPlanSchemaValidator } from "../swagger/list.plan.schema.validator";

export class ListByPlanService extends OpenAPIRoute {
	schema = listByPlanSchemaValidator;

	// Handle listing customers by subscription plan
	async handle(context: Context): Promise<Response> {
		// Validate incoming data against the schema
		const data = await this.getValidatedData<typeof this.schema>();
		let { page, planId } = data.query;
		page = getPage(page); // Normalize the page number

		// Retrieve all customer keys from the database
		const keys = await context.env.CUSTOMER_KV.list();
		const { totalPages, startIndex, endIndex } = pagination(page, keys.keys.length);

		const customers: Customer[] = [];
		// Iterate through the keys to find customers with the specified plan ID
		for (const key of keys.keys.slice(startIndex, endIndex)) {
			const customer = await context.env.CUSTOMER_KV.get(key.name);
			if (customer) {
				const parsed = JSON.parse(customer) as Customer;
				// Check if the customer's subscription plan matches the requested plan ID
				if (parsed.subscriptionPlanId === planId) {
					customers.push(parsed);
				}
			}
		}

		// Return success response with customer data and pagination info
		return context.json({
			success: true,
			result: {
				data: customers
			},
			pagination: {
				currentPage: page,
				totalPages: totalPages,
				totalCount: keys.keys.length,
			},
		}, 200);
	}
}