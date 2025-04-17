export interface User {
    id: number
    name: string
    avatar: string
    email: string
}

export interface StockPile {
    id: string,
    productId: string,
    amount: number,
    frozen: number,
}

export interface Product {
    id: string,
    title: string,
    price: number,
    rate: number,
    description: string,
    cover: string,
    detail: string,
    specifications: Specification[],
    stockpile: StockPile
}

export interface Specification {
    id: string,
    item: string,
    value: string,
    productId: string
}

export interface Carts {
    cartItemId: string,
    userId: string,
    productId: string,
    quantity: string,
}

export interface Orders {
    orderId: string,
    userId: string,
    totalAmount: string,
    paymentMethod: string,
    status: string,
    createTime: string,
}

export interface CartItem {
    cartItemId: number,
    productId: number,
    title: string,
    price: number,
    quantity: number,
    cover: string,
    description: string,
}
