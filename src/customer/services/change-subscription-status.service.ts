import { DateTime } from "luxon";
import { OpenAPIRoute } from "chanfana";
import { Customer, CustomerSchema } from "../entities/customer.entity";
import { ChangeSubscriptionStatusSchemaValidator } from "../swagger/change-subscription-status.schema.validator";
import { serializeResponse } from "../../core/utils";

export class ChangeSubscriptionStatusService extends OpenAPIRoute {
	schema = ChangeSubscriptionStatusSchemaValidator;

	// Handle changing the subscription status of a customer
	async handle(context) {
		const customerId = context.req.param('customerId');
		const payload = await context.req.json();
		console.log('Customer ID: ', customerId);
		console.log('Payload: ', payload);

		try {
			// Verify if the provided Customer ID is valid
			const existingCustomer = await context.env.CUSTOMER_KV.get(customerId);
			if (!existingCustomer) {
				return context.json({ success: false, error: 'Invalid Customer ID' }, 400);
			}

			// Parse existing customer data and prepare update
			const parsedCustomer = JSON.parse(existingCustomer);
			const updateDto: Partial<Customer> = {
				...parsedCustomer,
				subscriptionStatus: payload.subscriptionStatus,
				updatedAt: DateTime.now().toISO(),
			};
			// Update customer data in the database
			await context.env.CUSTOMER_KV.put(customerId, JSON.stringify(updateDto));

			return context.json({
				success: true,
				result: {
					data: updateDto
				}
			}, 201);
		} catch (err) {
			// Handle errors and return failure response
			return context.json({
				success: false,
				message: err.message,
			}, 400); // Changed to 400 for client error
		}
	}
}