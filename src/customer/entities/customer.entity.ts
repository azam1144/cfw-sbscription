import {z} from "zod";
import {customerStatus} from "../const/customer-status";
import {SubscriptionPlanSchema} from "../../subscription/entities/subscription.entity";
import {customerSubscriptionStatus} from "../const/customer-subscription-status";
import {v4 as uuidv4} from "uuid";

export const CustomerSchema = z.object({
    id: z.string().default(() => uuidv4()),
    name: z.string().min(1),
    email: z.string(),
    status: z.enum(Object.values(customerStatus) as [string]).optional(),
});
export type CustomerInput = z.infer<typeof SubscriptionPlanSchema>;
export type Customer = CustomerInput & {
    subscriptionPlanId?: string;
    billingCycleEndDate?: Date;
    subscriptionStatus: string,
    wallet?: number,
    createdAt: string;
    updatedAt: string;
};

export const CreateCustomerSchema = CustomerSchema.omit({ id: true });

export const ChangePlanStatusSchema = z.object({
    subscriptionStatus: z.enum(Object.values(customerSubscriptionStatus) as [string]).optional(),
});