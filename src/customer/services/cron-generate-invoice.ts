import moment from "moment/moment";
import { OpenAPIRoute } from "chanfana";
import { GenerateInvoice } from "./generate-invoice";
import { Customer } from "../entities/customer.entity";
import { customerSubscriptionStatus } from "../const/customer-subscription-status";

const generateInvoice = new GenerateInvoice();
export class CronGenerateInvoice extends OpenAPIRoute {
    async handle(context) {
        const keys = await context.env.CUSTOMER_KV.list();
        console.log('keys: ', keys.keys);

        const subscribers = await this.getActiveSubscribers(context, keys.keys);
        console.log('subscribers: ', subscribers);

        for (const subscriber of subscribers) {

            const planId = subscriber['subscriptionPlanId'];
            console.log('planId: ', planId);

            const existingPlan = await context.env.SUBSCRIPTION_KV.get(planId);
            console.log('existingPlan: ', existingPlan);
            if (existingPlan) {
                const parsedPlan = JSON.parse(existingPlan);
                console.log('parsedPlan: ', parsedPlan);

                // Perform two operations
                // 1. Create invoice
                // 2. charge user immediately
                const processPayment = true;
                await generateInvoice.generate(context, parsedPlan, subscriber, processPayment);
            }
        }
        return context.json({
            success: true,
            result: {
                data: {
                    message: 'Operation is performed successfully!',
                }
            }
        }, 201);
    }

    private async getActiveSubscribers(context, subscribers: any): Promise<Customer[]> {
        const customers: Customer[] = [];
        for (const key of subscribers) {
            const customer = await context.env.CUSTOMER_KV.get(key.name);
            if (customer) {
                const parsed = JSON.parse(customer) as Customer;
                const status = parsed['subscriptionStatus'];
                const billingEndDate = parsed.billingCycleEndDate;
                if (
                    (status === customerSubscriptionStatus.ACTIVE || status === customerSubscriptionStatus.RESUMED) &&
                    billingEndDate && moment().toISOString() >=  moment(billingEndDate?.toString()).toISOString()
                ) {
                    customers.push(parsed);
                }
            }
        }

        return customers;
    }
}
