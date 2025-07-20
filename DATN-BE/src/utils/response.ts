// utils/response.ts

export function returnMessage(type: number, data: any, message: string): object {
    if (type === 1) {
        return {
            type: 'success',
            status: 'success',
            message,
            data,
        };
    } else {
        return {
            type: 'error',
            status: 'error',
            message,
            data,
        };
    }
}
