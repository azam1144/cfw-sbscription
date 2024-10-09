import {z} from "zod";
import {SubscriptionPlanSchema} from "../entities/subscription.entity";
export const PartialSubscriptionPlanSchema = SubscriptionPlanSchema.partial();

export const UpdateSchemaValidator = {
    tags: ["Subscriptions"],
    summary: "Get a single Subscription by slug",
    request: {
        params: z.object({
            id: z.string({ description: "Subscription ID" }),
        }),
        body: {
            content: {
                "application/json": {
                    schema: PartialSubscriptionPlanSchema,
                },
            },
        },
    },
    responses: {
        "200": {
            description: "Returns a single subscription if found",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean(),
                        result: z.object({
                            data: SubscriptionPlanSchema,
                        }),
                    }),
                },
            },
        },
        "404": {
            description: "Subscription not found",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean(),
                        error: z.string(),
                    }),
                },
            },
        },
    },
};