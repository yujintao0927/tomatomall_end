export interface User {
    id: number
    name: string
    avatar: string
    email: string
    readingTime: string
    booksRead: number
    favoriteGenre: string
}

export interface StockPile {
    id: string,
    productId: string,
    amount: number,
    frozen: number,
    total: number
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

export interface Book {
    id: number,
    title: string,
    author: string,
    cover: string,
    progress: number
}