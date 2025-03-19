import { Roles, User } from "../types/user";
import { faker } from '@faker-js/faker';

// TODO: Ensure that username, firstName and lastName is at least 4 characters long
export const generateUser = (): User => {
    return {
        username: faker.internet.username(),
        password: faker.internet.password({ length: 8 }),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        roles: [Roles.ROLE_ADMIN, Roles.ROLE_CLIENT]
    }
}