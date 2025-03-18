import { CartItem } from "./cartItem";

export interface Cart {
    username: string;
    items: CartItem[];
    totalPrice: number;
    totalItems: number;
}