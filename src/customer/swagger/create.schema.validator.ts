import {z} from "zod";
import {Bool} from "chanfana";
import {CreateCustomerSchema, CustomerSchema} from "../entities/customer.entity";

export const createSchemaValidator = {
    tags: ["Customers"],
    summary: "CreateService a new Customer",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: CreateCustomerSchema,
                },
            },
        },
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