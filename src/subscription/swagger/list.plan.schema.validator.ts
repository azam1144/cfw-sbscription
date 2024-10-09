import {z} from "zod";
import {Bool, Num, Str} from "chanfana";
import {CustomerSchema} from "../../customer/entities/customer.entity";

export const listByPlanSchemaValidator = {
    tags: ["Subscriptions"],
    summary: "List Subscription's customer",
    request: {
        query: z.object({
            page: Num({
                description: "Page number",
                default: 1,
                required: false,
                example: 1,
            }),
            planId: Str({
                description: "Subscription Plan id",
                required: false,
            }),
        }),
    },
    responses: {
        "200": {
            description: "Returns a list of Customers",
            content: {
                "application/json": {
                    schema: z.object({
                        success: Bool(),
                        result: z.object({
                            data: CustomerSchema.array(),
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