import { User } from "../types/user";

declare global {
    namespace Cypress {
        interface Chainable {
            register(user: User): void
        }
    }
}