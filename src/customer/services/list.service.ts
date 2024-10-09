import { Context } from 'hono';
import { OpenAPIRoute } from "chanfana";
import { getPage, pagination } from "../../core/utils";
import { Customer } from "../entities/customer.entity";
import { listSchemaValidator } from "../swagger/list.schema.validator";

export class ListService extends OpenAPIRoute {
	schema = listSchemaValidator;

	async handle(context: Context): Promise<Response> {
		const data = await this.getValidatedData<typeof this.schema>();
		let { page, status } = data.query;
		page = getPage(page);

		const keys = await context.env.CUSTOMER_KV.list();
		const {totalPages, startIndex, endIndex} = pagination(page, keys.keys.length);

		const customers: Customer[] = [];
		for (const key of keys.keys.slice(startIndex, endIndex)) {
			const customer = await context.env.CUSTOMER_KV.get(key.name);
			if (customer) {
				const parsed = JSON.parse(customer) as Customer;
				if (status && parsed.status === status) {
					customers.push(parsed);
				} else {
					customers.push(parsed);
				}
			}
		}

		return context.json({
			success: true,
			result: {
				data: customers
			},
			pagination: {
				currentPage: page,
				totalPages: totalPages,
				totalCount: keys.keys.length,
			},
		}, 200);
	}
}
