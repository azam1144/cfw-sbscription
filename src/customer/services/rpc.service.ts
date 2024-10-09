import {api, ApiResponse} from "../../core/utils";
import {CreateInvoiceType} from "../const/create-invoice.type";

export class RpcService {
    private context;

    constructor(context: any) {
        this.context = context;
    }

    async createInvoice(createInvoicePayload: CreateInvoiceType, processPayment: boolean): Promise<ApiResponse> {
        return await api(`${this.context.env.INVOICE_WORKER_URL}/invoice/create?processPayment=${processPayment}`, 'POST', createInvoicePayload);
    }
}