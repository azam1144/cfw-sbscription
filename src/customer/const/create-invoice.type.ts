export type CreateInvoiceType = {
    status: string,
    payment_status: string,
    amount?: number,
    customer_id: string,
    payment_date: string,
    due_date: string,
    content: string,
}