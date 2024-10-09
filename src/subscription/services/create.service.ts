import {Context} from "hono";
import { DateTime } from "luxon";
import {OpenAPIRoute} from "chanfana";
import {createSchemaValidator} from "../swagger/create.schema.validator";
import {SubscriptionPlan, SubscriptionPlanSchema} from "../entities/subscription.entity";

export class CreateService extends OpenAPIRoute {
	schema = createSchemaValidator;
	async handle(context: Context) {
		const result = SubscriptionPlanSchema.safeParse(await context.req.json());
		if (!result.success) {
			return context.json({ success: false, error: 'Invalid subscription plan data', details: result.error }, 400);
		}

		const newPlan: SubscriptionPlan = {
			createdAt: DateTime.now().toISO(),
			updatedAt: DateTime.now().toISO(),
			...result.data
		};

		const subscriptionData = SubscriptionPlanSchema.parse(newPlan);
		await context.env.SUBSCRIPTION_KV.put(subscriptionData.id, JSON.stringify(subscriptionData));

		return context.json({
			success: true,
			result: {
				data: subscriptionData
			}
		}, 201);
	}
}
