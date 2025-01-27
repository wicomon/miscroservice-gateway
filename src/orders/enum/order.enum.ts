export enum OrderStatus {
    PENDING = 'PENDING',
    DELIVERED = 'DELIVERED',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
}
export const OrderStatusList = [
    OrderStatus.PENDING,
    OrderStatus.DELIVERED,
    OrderStatus.CONFIRMED,
    OrderStatus.CANCELLED,
];