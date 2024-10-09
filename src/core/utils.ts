import {BillingCycle} from "../subscription/const/billing-cycle";
import moment from "moment/moment";

export const pagination = (page: number, keysLength: number): { totalPages: number; startIndex: number; endIndex: number } => {
    const pageSize = 10; // Number of results per page

    const totalPages = Math.ceil(keysLength / pageSize);
    const startIndex = (page === 1 ? page : page * pageSize) - 1;
    const endIndex = Math.min(startIndex + pageSize, keysLength);
    return { totalPages, startIndex, endIndex };
}

export const getPage = (page: any): number => {
    return typeof page !== 'number' || !page || page < 1 ? 1 : page;
}

export const getMomentDateDuration = (period: string) => {
    if (period === BillingCycle.WEEKLY) return 'weeks';
    if (period === BillingCycle.MONTHLY) return 'months';
    if (period === BillingCycle.YEARLY) return 'years';
    return 'day';
}

export const getDurationInDays = (period: string) => {
    if (period === BillingCycle.WEEKLY) return 7;
    if (period === BillingCycle.MONTHLY) return 30;
    if (period === BillingCycle.YEARLY) return 365;
    return 7;
}

export const momentAddDuration = (billing_cycle: string, date?: Date) => {
    if (date) {
        return moment(date).clone().add(1, getMomentDateDuration(billing_cycle)).toISOString()
    }
    return moment().clone().add(1, getMomentDateDuration(billing_cycle)).toISOString()
}

export const api = async (route: string, method: string, body?: any): Promise<ApiResponse> => {
    const reqBody = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    if (body) {
        reqBody['body'] = JSON.stringify(body);
    }
    console.log('route: ', route);
    console.log('reqBody: ', reqBody);
    const response = await fetch(route, reqBody);
    console.log('response: ', response);

    if (!response.ok) {
        return { success: false, message: `HTTP error! status: ${response.status}`, code: response.status };
    }

    return response.json();
}

export const serializeResponse = (response: ApiResponse): any => {
    return response.result.data
}

export interface ApiResponse {
    success: boolean;
    result?: {
        data: any
    },
    message?: string,
    code?: number,
}