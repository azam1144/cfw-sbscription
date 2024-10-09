import {z} from "zod";
import {Bool, Str} from "chanfana";
import {CustomerSchema} from "../entities/customer.entity";

export const DeleteSchemaValidator = {
    tags: ["Admin Operations"],
    summary: "DeleteService a Customer",
    request: {
        params: z.object({
            id: Str({ description: "Customer ID" }),
        }),
    },
    responses: {
        "200": {
            description: "Returns if the Customer was deleted successfully",
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