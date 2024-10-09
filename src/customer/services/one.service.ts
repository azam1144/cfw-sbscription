import {OpenAPIRoute} from "chanfana";
import {OneSchemaValidator} from "../swagger/one.schema.validator";

export class OneService extends OpenAPIRoute {
	schema = OneSchemaValidator;

	async handle(context) {
		const id = context.req.param('id');
		const existingPlan = await context.env.CUSTOMER_KV.get(id);
		console.log('existingPlan: ', existingPlan);

		if (!existingPlan) {
			return context.json({ success: false, error: 'Invalid Customer' }, 404);
		}
		return context.json({
			success: true,
			result: {
				data: JSON.parse(await context.env.CUSTOMER_KV.get(id))
			}
		}, 201);
	}
}
