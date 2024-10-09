import { DateTime } from "luxon";
import { OpenAPIRoute } from "chanfana";
import { Customer } from "../entities/customer.entity";
import { ChangeSubscriptionPlanSchemaValidator } from "../swagger/change-subscription-plan.schema.validator";
import { getDurationInDays, momentAddDuration } from "../../core/utils";
import { SubscriptionPlan } from "../../subscription/entities/subscription.entity";
import { customerSubscriptionStatus } from "../const/customer-subscription-status";
import { GenerateInvoice } from "./generate-invoice";

const generateInvoice = new GenerateInvoice();

export class ChangeSubscriptionPlanService extends OpenAPIRoute {
	schema = ChangeSubscriptionPlanSchemaValidator; // Define the schema for validation

	async handle(context) {
		// Extract customerId and planId from the request parameters
		const { customerId, planId }: { customerId: string; planId: string } = await context.req.param();

		try {
			// Verify if the provided Customer ID is valid
			const existingCustomer = await context.env.CUSTOMER_KV.get(customerId);
			if (!existingCustomer) {
				return context.json({ success: false, error: 'Invalid Customer ID' }, 400); // Return error if customer is not found
			}

			// Verify if the provided Plan ID is valid
			const newPlan = await context.env.SUBSCRIPTION_KV.get(planId);
			if (!newPlan) {
				return context.json({ success: false, error: 'Invalid new Plan ID' }, 400); // Return error if plan is not found
			}

			// Parse the existing customer and old plan details
			const parsedCustomer = JSON.parse(existingCustomer);
			const oldPlan = await context.env.SUBSCRIPTION_KV.get(parsedCustomer.subscriptionPlanId);

			const parsedNewPlan = JSON.parse(newPlan);
			const parsedOldPlan = JSON.parse(oldPlan);
			const billingPeriodDays = getDurationInDays(parsedNewPlan.billing_cycle); // Get the duration of the new plan's billing cycle in days

			// Calculate the number of days remaining in the current billing cycle
			const daysRemaining = (new Date(parsedCustomer.billingCycleEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);

			// Calculate the prorated charge for the subscription change
			const proratedCharge = this.calculateProratedAmount(parsedOldPlan, parsedNewPlan, daysRemaining, billingPeriodDays);

			// Update the customer's subscription details
			parsedCustomer.subscriptionPlanId = planId; // Set the new subscription plan ID
			parsedCustomer.wallet = proratedCharge; // Update the wallet with the prorated charge
			parsedCustomer.subscriptionStatus = customerSubscriptionStatus.ACTIVE; // Set the subscription status to active
			parsedCustomer.billingCycleEndDate = momentAddDuration(parsedNewPlan.billing_cycle); // Update the billing cycle end date

			// Prepare the update data for the customer
			const updateDto: Partial<Customer> = {
				...parsedCustomer,
				updatedAt: DateTime.now().toISO(), // Set the updated timestamp
			};
			// Save the updated customer data
			await context.env.CUSTOMER_KV.put(customerId, JSON.stringify(updateDto));

			// If there is a prorated charge, generate an invoice and charge the user
			if (proratedCharge > 0) {
				const processPayment = true; // Flag to indicate payment processing
				await generateInvoice.generate(context, parsedOldPlan, parsedCustomer, processPayment); // Generate the invoice
			}

			// Return success response with updated customer data
			return context.json({
				success: true,
				result: {
					data: updateDto
				}
			}, 201);
		} catch (err) {
			// Handle errors and return error response
			return context.json({
				success: false,
				message: err.message,
			}, 201);
		}
	}

	// Calculate the prorated amount based on the old and new plans
	private calculateProratedAmount(oldPlan: SubscriptionPlan, newPlan: SubscriptionPlan, daysRemaining: number, billingPeriodDays: number): number {
		const amountPerDayOld = oldPlan.price / billingPeriodDays; // Calculate daily rate for old plan
		const amountPerDayNew = newPlan.price / billingPeriodDays; // Calculate daily rate for new plan
		const proratedCredit = amountPerDayOld * daysRemaining; // Calculate credit for unused days of old plan
		const proratedCharge = Number((amountPerDayNew * billingPeriodDays) - proratedCredit).toFixed(2); // Calculate final prorated charge
		return Number(proratedCharge); // Return the prorated charge as a number
	}
}