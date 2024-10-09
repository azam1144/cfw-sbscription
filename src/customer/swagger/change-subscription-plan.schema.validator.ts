import {z} from "zod";
import {Bool, Str} from "chanfana";
import {ChangePlanStatusSchema} from "../entities/customer.entity";

export const ChangeSubscriptionPlanSchemaValidator = {
    tags: ["Customers"],
    summary: "Change subscription Plan",
    request: {
        params: z.object({
            customerId: Str({ description: "Customer ID" }),
            planId: Str({ description: "Plan ID" }),
        }),
    },
    responses: {
        "200": {
            description: "Returns the Customer record",
            content: {
                "application/json": {
                    schema: z.object({
                        success: Bool(),
                        result: z.object({
                            data: ChangePlanStatusSchema,
                        }),
                    }),
                },
            },
        },
    },
};