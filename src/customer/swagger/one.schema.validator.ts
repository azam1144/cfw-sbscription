import {z} from "zod";
import {Bool, Str} from "chanfana";
import {CustomerSchema} from "../entities/customer.entity";

export const OneSchemaValidator = {
    tags: ["Customers"],
    summary: "Get OneService Customer",
    request: {
        params: z.object({
            id: Str({ description: "Customer ID" }),
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
                        })
                    }),
                },
            },
        },
    },
};