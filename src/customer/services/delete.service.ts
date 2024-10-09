import { OpenAPIRoute } from "chanfana";
import {DeleteSchemaValidator} from "../swagger/delete.schema.validator";
import {Customer} from "../entities/customer.entity";
import {DateTime} from "luxon";
import {customerStatus} from "../const/customer-status";

export class DeleteService extends OpenAPIRoute {
	schema = DeleteSchemaValidator;

	async handle(context) {
		const id = context.req.param('id');
		const existing = await context.env.CUSTOMER_KV.get(id);
		if (!existing) {
			return context.json({ success: false, error: 'Invalid Customer' }, 404);
		}

		const parsed = JSON.parse(existing);
		const update: Partial<Customer> = {
			...parsed,
			status: customerStatus.DELETED,
			updatedAt: DateTime.now().toISO(),
		};
		await context.env.CUSTOMER_KV.put(id, JSON.stringify(update));

		return context.json({
			success: true,
			result: {
				data: parsed
			}
		}, 200);
	}
}
