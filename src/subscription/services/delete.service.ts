import {Context} from "hono";
import { OpenAPIRoute } from "chanfana";
import {DeleteSchemaValidator} from "../swagger/delete.schema.validator";

export class DeleteService extends OpenAPIRoute {
	schema = DeleteSchemaValidator;

	async handle(context: Context) {
		const id = context.req.param('id');
		const existingPlan = await context.env.SUBSCRIPTION_KV.get(id);
		if (!existingPlan) {
			return context.json({ success: false, error: 'Invalid subscription' }, 404);
		}
		await context.env.SUBSCRIPTION_KV.delete(id);

		return context.json({
			success: true,
			result: {
				data: JSON.parse(existingPlan)
			}
		}, 200);
	}
}
