import {z} from "zod";
import {Bool, Str} from "chanfana";
import {SubscriptionPlanSchema} from "../entities/subscription.entity";

export const DeleteSchemaValidator = {
    tags: ["Subscriptions"],
    summary: "DeleteService a Subscription",
    request: {
        params: z.object({
            id: Str({ description: "Subscription ID" }),
        }),
    },
    responses: {
        "200": {
            description: "Returns if the Subscription was deleted successfully",
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