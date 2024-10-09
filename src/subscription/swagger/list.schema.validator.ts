import {z} from "zod";
import {Bool, Num} from "chanfana";
import {SubscriptionPlanSchema} from "../entities/subscription.entity";

export const listSchemaValidator = {
    tags: ["Subscriptions"],
    summary: "ListService Subscriptions",
    request: {
        query: z.object({
            page: Num({
                description: "Page number",
                default: 1,
                required: false,
                example: 1,
            }),
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
                        }),
                        pagination: z.object({
                            currentPage: z.number(),
                            totalPages: z.number(),
                            totalCount: z.number(),
                        }),
                    }),
                },
            },
        },
    },
};