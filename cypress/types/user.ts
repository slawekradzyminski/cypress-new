export interface User {
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    roles: Roles[]
}

export enum Roles {
    ROLE_ADMIN = 'ROLE_ADMIN',
    ROLE_CLIENT = 'ROLE_CLIENT'
}