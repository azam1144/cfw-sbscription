import {DateTime} from "luxon";
import { OpenAPIRoute } from "chanfana";
import {UpdateSchemaValidator} from "../swagger/update.schema.validator";
import {CreateCustomerSchema, Customer, CustomerSchema} from "../entities/customer.entity";

export class UpdateService extends OpenAPIRoute {
	schema = UpdateSchemaValidator;

	async handle(context) {
		const id = context.req.param('id');
		console.log('id: ', id);

		const payload = await context.req.json();
		console.log('payload: ', payload);

		const existing = await context.env.CUSTOMER_KV.get(id);
		console.log('existingPlan: ', existing);

		if (!existing) {
			return context.json({ success: false, error: 'Invalid Customer' }, 404);
		}

		const update: Partial<Customer> = {
			...JSON.parse(existing),
			...payload,
			updatedAt: DateTime.now().toISO(),
		};
		await context.env.CUSTOMER_KV.put(id, JSON.stringify(update));
		return context.json({
			success: true,
			result: {
				data: JSON.parse(await context.env.CUSTOMER_KV.get(id))
			}
		}, 201);
	}
}
