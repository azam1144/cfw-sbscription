import {z} from "zod";
import {Bool, Num, Str} from "chanfana";
import {CustomerSchema} from "../entities/customer.entity";

export const listSchemaValidator = {
    tags: ["Customers"],
    summary: "ListService Customers",
    request: {
        query: z.object({
            page: Num({
                description: "Page number",
                default: 1,
                required: false,
                example: 1,
            }),
            status: Str({
                description: "Apply Status",
                default: 1,
                required: false,
                example: "Active",
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