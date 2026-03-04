import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface OrderItem {
    engravingText?: string;
    quantity: bigint;
    product: Product;
}
export interface Order {
    customer: Principal;
    orderStatus: {
        __kind__: "shipped";
        shipped: null;
    } | {
        __kind__: "pending";
        pending: null;
    } | {
        __kind__: "paid";
        paid: {
            stripeSessionId: string;
        };
    };
    orderId: string;
    totalAmount: bigint;
    checkoutSessionId?: string;
    items: Array<OrderItem>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ContactMessage {
    name: string;
    email: string;
    message: string;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface CartItem {
    productId: string;
    quantity: bigint;
}
export interface Product {
    id: string;
    name: string;
    description: string;
    story: string;
    imageUrl: string;
    category: string;
    engravingAvailable: boolean;
    priceInCents: bigint;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<void>;
    addToCart(productId: string, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createOrder(items: Array<OrderItem>): Promise<Order | null>;
    deleteProduct(productId: string): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getContactMessages(): Promise<Array<ContactMessage>>;
    getProducts(): Promise<Array<Product>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserOrders(): Promise<Array<Order>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedProducts(): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitContactMessage(message: ContactMessage): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateProduct(product: Product): Promise<void>;
}
