export const types = {
    login: 'LOG_IN',
    logout: 'LOG_OUT'
} as const;

export interface AuthUser {
    id: number;
    name: string;
}
