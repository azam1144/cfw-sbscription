import { OpenAPIRoute } from "chanfana";
import {SubscriptionPlan} from "../entities/subscription.entity";
import {listSchemaValidator} from "../swagger/list.schema.validator";
import {getPage, pagination} from "../../core/utils";

export class ListService extends OpenAPIRoute {
	schema = listSchemaValidator;

	async handle(c) {
		const data = await this.getValidatedData<typeof this.schema>();
		let { page } = data.query;
		page = getPage(page);

		const keys = await c.env.SUBSCRIPTION_KV.list();
		const {totalPages, startIndex, endIndex} = pagination(page, keys.keys.length);

		const plans: SubscriptionPlan[] = [];

		for (const key of keys.keys.slice(startIndex, endIndex)) {
			const plan = await c.env.SUBSCRIPTION_KV.get(key.name);
			if (plan) {
				plans.push(JSON.parse(plan) as SubscriptionPlan);
			}
		}

		return c.json({
			success: true,
			result: {
				data: plans
			},
			pagination: {
				currentPage: page,
				totalPages: totalPages,
				totalCount: keys.keys.length,
			},
		}, 200);
	}
}
