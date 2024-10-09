import {Context} from "hono";
import {OpenAPIRoute} from "chanfana";
import {OneSchemaValidator} from "../swagger/one.schema.validator";

export class OneService extends OpenAPIRoute {
	schema = OneSchemaValidator;

	async handle(context: Context) {
		const id = context.req.param('id');
		const existingPlan = await context.env.SUBSCRIPTION_KV.get(id);
		console.log('existingPlan: ', existingPlan);

		if (!existingPlan) {
			// return context.json({ success: false, error: 'Invalid subscription' }, 404);
		}

		console.log('existingPlan: ', existingPlan);

		return context.json({
			success: true,
			result: {
				data: JSON.parse(existingPlan)
			}
		}, 201);
	}
}
