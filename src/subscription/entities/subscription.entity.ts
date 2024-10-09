import {z} from "zod";
import {v4 as uuidv4} from "uuid";
import {BillingCycle} from "../const/billing-cycle";
import {subscriptionStatus} from "../const/subscription-status";

export const SubscriptionPlanSchema = z.object({
	id: z.string().default(() => uuidv4()),
	name: z.string().min(1).optional(),
	price: z.number().positive().optional(),
	status: z.enum(Object.values(subscriptionStatus) as [string]).optional(),
	billing_cycle: z.enum(Object.values(BillingCycle) as [string]).optional(),
});

export type SubscriptionPlanInput = z.infer<typeof SubscriptionPlanSchema>;
export type SubscriptionPlan = SubscriptionPlanInput & {
	createdAt: string;
	updatedAt: string;
};

export const CreateSubscriptionPlanSchema = SubscriptionPlanSchema.omit({ id: true });
