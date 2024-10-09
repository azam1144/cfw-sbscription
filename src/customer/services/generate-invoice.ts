import { DateTime } from "luxon";
import { RpcService } from "./rpc.service";
import { UpdateService } from "./update.service";
import { momentAddDuration } from "../../core/utils";
import { Customer } from "../entities/customer.entity";
import { CreateInvoiceType } from "../const/create-invoice.type";
import { SubscriptionPlan } from "../../subscription/entities/subscription.entity";

export class GenerateInvoice {
    private rpcService;

    constructor() {}

    // Method to generate an invoice
    async generate(context, parsedPlan: SubscriptionPlan, parsedCustomer: Customer, processPayment: boolean): Promise<boolean> {
        this.rpcService = new RpcService(context); // Initialize RPC service

        // Calculate the charged amount and remaining prorated charges
        const { chargedAmount, proratedCharges } = this.applyProratedCharges(parsedPlan.price, parsedCustomer.wallet);

        // Create invoice payload
        const createInvoicePayload: CreateInvoiceType = {
            status: 'Generated',
            payment_status: 'Pending',
            amount: chargedAmount,
            customer_id: parsedCustomer.id,
            payment_date: DateTime.now().toISO(),
            due_date: momentAddDuration(parsedPlan.billing_cycle),
            content: 'Payment is processed successfully!',
        };

        // Create the invoice using the RPC service
        const response = await this.rpcService.createInvoice(createInvoicePayload, processPayment);

        // Update customer details if invoice creation was successful
        if (response.success) {
            const updateService = new UpdateService(context);
            const updateContext = {
                req: {
                    param: (key) => parsedCustomer.id,
                    json: async () => ({
                        ...parsedCustomer,
                        wallet: proratedCharges,
                        billingCycleEndDate: momentAddDuration(parsedPlan.billing_cycle),
                    }),
                },
                env: context.env,
            };
            await updateService.handle(updateContext); // Handle the update operation
        }

        return response.success; // Return the success status of the invoice creation
    }

    // Calculate the charged amount and remaining prorated charges
    private applyProratedCharges(parsedPlanPrice: number, proratedCharges: number): { chargedAmount: number; proratedCharges: number; } {
        let chargedAmount = parsedPlanPrice;

        // Adjust charged amount based on prorated charges
        if (proratedCharges < chargedAmount) {
            chargedAmount += proratedCharges;
            if (chargedAmount < 0) {
                chargedAmount = 0;
                proratedCharges += parsedPlanPrice;
            }
        } else {
            chargedAmount += proratedCharges;
            proratedCharges = 0;
        }

        return { chargedAmount, proratedCharges }; // Return calculated values
    }
}