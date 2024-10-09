import {z} from "zod";
import {Bool, Str} from "chanfana";
import {SubscriptionPlanSchema} from "../entities/subscription.entity";

export const OneSchemaValidator = {
    tags: ["Subscriptions"],
    summary: "Get OneService Subscription",
    request: {
        params: z.object({
            id: Str({ description: "Subscription ID" }),
        }),
    },
    responses: {
        "200": {
            description: "Returns a list of subscriptions",
            content: {
                "application/json": {
                    schema: z.object({
                        success: Bool(),
                        result: z.object({
                            data: SubscriptionPlanSchema.array(),
                        })
                    }),
                },
            },
        },
    },
};