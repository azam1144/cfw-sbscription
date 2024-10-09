import moment from "moment/moment";
import { OpenAPIRoute } from "chanfana";
import { GenerateInvoice } from "./generate-invoice";
import { Customer } from "../entities/customer.entity";
import { customerSubscriptionStatus } from "../const/customer-subscription-status";

const generateInvoice = new GenerateInvoice();

export class CronGenerateInvoice extends OpenAPIRoute {
    // Handle the cron job for generating invoices for active subscribers
    async handle(context) {
        // Retrieve all customer keys from the database
        const keys = await context.env.CUSTOMER_KV.list();

        // Get the list of active subscribers
        const subscribers = await this.getActiveSubscribers(context, keys.keys);

        // Process each active subscriber
        for (const subscriber of subscribers) {
            const planId = subscriber['subscriptionPlanId'];
            const existingPlan = await context.env.SUBSCRIPTION_KV.get(planId);

            if (existingPlan) {
                const parsedPlan = JSON.parse(existingPlan);
                // Generate invoice and charge user immediately
                const processPayment = true;
                await generateInvoice.generate(context, parsedPlan, subscriber, processPayment);
            }
        }

        // Return success response indicating the operation was completed
        return context.json({
            success: true,
            result: {
                data: {
                    message: 'Operation is performed successfully!',
                }
            }
        }, 201);
    }

    // Retrieve active subscribers based on their subscription status and billing date
    private async getActiveSubscribers(context, subscribers: any): Promise<Customer[]> {
        const customers: Customer[] = [];

        // Check each subscriber for active status and valid billing date
        for (const key of subscribers) {
            const customer = await context.env.CUSTOMER_KV.get(key.name);
            if (customer) {
                const parsed = JSON.parse(customer) as Customer;
                const status = parsed['subscriptionStatus'];
                const billingEndDate = parsed.billingCycleEndDate;

                // Determine if the customer is active and their billing date is valid
                if (
                    (status === customerSubscriptionStatus.ACTIVE || status === customerSubscriptionStatus.RESUMED) &&
                    billingEndDate && moment().isSameOrAfter(moment(billingEndDate?.toString()))
                ) {
                    customers.push(parsed);
                }
            }
        }

        return customers; // Return the list of active subscribers
    }
}