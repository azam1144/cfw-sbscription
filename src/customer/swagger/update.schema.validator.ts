import {z} from "zod";
import {CreateCustomerSchema, CustomerSchema} from "../entities/customer.entity";
export const PartialCustomerSchema = CreateCustomerSchema.partial();

export const UpdateSchemaValidator = {
    tags: ["Customers"],
    summary: "Get a single Customer by slug",
    request: {
        params: z.object({
            id: z.string({ description: "Customer ID" }),
        }),
        body: {
            content: {
                "application/json": {
                    schema: PartialCustomerSchema,
                },
            },
        },
    },
    responses: {
        "200": {
            description: "Returns a single Customer if found",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean(),
                        result: z.object({
                            data: CustomerSchema,
                        }),
                    }),
                },
            },
        },
        "404": {
            description: "Customer not found",
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