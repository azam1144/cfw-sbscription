import {z} from "zod";
import {Bool, Str} from "chanfana";
import {ChangePlanStatusSchema, CustomerSchema} from "../entities/customer.entity";

export const ChangeSubscriptionStatusSchemaValidator = {
    tags: ["Customers"],
    summary: "Change subscription status",
    request: {
        params: z.object({
            customerId: Str({ description: "Customer ID" }),
        }),
        body: {
            content: {
                "application/json": {
                    schema: ChangePlanStatusSchema,
                },
            },
        },
    },
    responses: {
        "200": {
            description: "Returns the Customer record",
            content: {
                "application/json": {
                    schema: z.object({
                        success: Bool(),
                        result: z.object({
                            data: CustomerSchema,
                        }),
                    }),
                },
            },
        },
    },
};