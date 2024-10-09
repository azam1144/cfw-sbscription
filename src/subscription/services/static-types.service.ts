import {OpenAPIRoute} from "chanfana";
import {BillingCycle} from "../const/billing-cycle";
import {subscriptionStatus} from "../const/subscription-status";
import {StaticTypesSchemaValidator} from "../swagger/static-types.schema.validator";
import {customerSubscriptionStatus} from "../../customer/const/customer-subscription-status";
import {customerStatus} from "../../customer/const/customer-status";

export class StaticTypesService extends OpenAPIRoute {
	schema = StaticTypesSchemaValidator;
	async handle(context: any): Promise<any> {
		return {
			subscriptionStatus: Object.values(subscriptionStatus),
			billingCycle: Object.values(BillingCycle),
			customerSubscriptionStatus: Object.values(customerSubscriptionStatus),
			customerStatus: Object.values(customerStatus),
		}
	}
}
