import { DateTime } from "luxon";
import { OpenAPIRoute } from "chanfana";
import { GenerateInvoice } from "./generate-invoice";
import { Customer } from "../entities/customer.entity";
import { AssociateSchemaValidator } from "../swagger/associate.schema.validator";

const generateInvoice = new GenerateInvoice();

export class AssociateService extends OpenAPIRoute {
	schema = AssociateSchemaValidator;

	// Handle customer and subscription plan association
	async handle(context) {
		const { customerId, planId }: { customerId: string; planId: string } = await context.req.param();

		try {
			// Verify if the provided Customer ID is valid
			const existingCustomer = await context.env.CUSTOMER_KV.get(customerId);
			if (!existingCustomer) {
				return context.json({ success: false, error: 'Invalid Customer ID' }, 400);
			}

			// Verify if the provided subscription/plan ID is valid
			const existingPlan = await context.env.SUBSCRIPTION_KV.get(planId);
			console.log('Existing Plan: ', existingPlan);
			if (!existingPlan) {
				return context.json({ success: false, error: 'Invalid subscription ID' }, 400);
			}

			// Parse existing customer and plan data
			const parsedCustomer = JSON.parse(existingCustomer);
			const parsedPlan = JSON.parse(existingPlan);

			// Update customer with the new subscription plan
			const updateDto: Partial<Customer> = {
				...parsedCustomer,
				subscriptionPlanId: planId,
				updatedAt: DateTime.now().toISO(),
			};
			await context.env.CUSTOMER_KV.put(customerId, JSON.stringify(updateDto));

			// Generate invoice for the updated subscription
			const processPayment = true;
			await generateInvoice.generate(context, parsedPlan, parsedCustomer, processPayment);

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
			}, 400);
		}
	}
}