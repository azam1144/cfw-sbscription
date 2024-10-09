import {z} from "zod";
import {Bool, Str} from "chanfana";
import {CustomerSchema} from "../entities/customer.entity";

export const AssociateSchemaValidator = {
    tags: ["Customers"],
    summary: "CreateService a new Customer",
    request: {
        params: z.object({
            planId: Str({ description: "Subscription Plan ID" }),
            customerId: Str({ description: "Customer ID" }),
        }),
    },
    responses: {
        "200": {
            description: "Returns the created Customer",
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