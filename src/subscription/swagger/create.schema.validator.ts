import {CreateSubscriptionPlanSchema, SubscriptionPlanSchema} from "../entities/subscription.entity";
import {z} from "zod";
import {Bool} from "chanfana";

export const createSchemaValidator = {
    tags: ["Subscriptions"],
    summary: "CreateService a new Subscription",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: CreateSubscriptionPlanSchema,
                },
            },
        },
    },
    responses: {
        "200": {
            description: "Returns the created subscription",
            content: {
                "application/json": {
                    schema: z.object({
                        success: Bool(),
                        result: z.object({
                            data: SubscriptionPlanSchema,
                        }),
                    }),
                },
            },
        },
    },
};