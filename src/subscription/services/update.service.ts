import { Context } from "hono";
import { DateTime } from "luxon";
import { OpenAPIRoute } from "chanfana";
import { UpdateSchemaValidator } from "../swagger/update.schema.validator";
import { SubscriptionPlan, SubscriptionPlanSchema } from "../entities/subscription.entity";

export class UpdateService extends OpenAPIRoute {
	schema = UpdateSchemaValidator;

	async handle(context: Context) {
		const id = context.req.param('id');
		const result = SubscriptionPlanSchema.safeParse(await context.req.json());
		if (!result.success) {
			return context.json({ success: false, error: 'Invalid subscription plan data' }, 400);
		}

		const existingPlan = await context.env.SUBSCRIPTION_KV.get(id);
		if (!existingPlan) {
			return context.json({ success: false, error: 'Invalid subscription' }, 404);
		}

		const updatePlan: Partial<SubscriptionPlan> = {
			...JSON.parse(existingPlan),
			...result.data,
			updatedAt: DateTime.now().toISO(),
		};
		await context.env.SUBSCRIPTION_KV.put(id, JSON.stringify(updatePlan));
		return context.json({
			success: true,
			result: {
				data: JSON.parse(await context.env.SUBSCRIPTION_KV.get(id))
			}
		}, 201);
	}
}
