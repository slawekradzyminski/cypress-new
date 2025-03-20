import { Roles, User } from "../types/user";
import { faker } from "@faker-js/faker";

const MIN_LENGTH = 4;
const MAX_ATTEMPTS = 20;

const isValid = (str: string) => str.length >= MIN_LENGTH;

export const generateUser = (): User => {
    let attempts = 0;
    let user: User;

    do {
        user = {
            username: faker.internet.username(),
            password: faker.internet.password({ length: 8 }),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            roles: [Roles.ROLE_ADMIN, Roles.ROLE_CLIENT],
        };
        attempts++;
    } while (!(isValid(user.username) && isValid(user.firstName) && isValid(user.lastName)) && attempts < MAX_ATTEMPTS);

    return user;
};
