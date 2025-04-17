import {PRODUCT_MODULE, SHOPPING_MODULE} from "../api/_prefix";
import {axios} from "../utils/request.ts";
import {Carts, Orders, Product} from "../type";

type addProductToCart = {
    productId: string,
    quantity: number
};

type updateCartItemQuantity = {
    cartItemId: string,
    quantity: number,
}

type submitOrderInfo = {
    cartItemIds: string[],
    shipping_address: string
    payment_method: string
}

export const addProductToCart = (addToCart: addProductToCart) => {
    return axios.post(`${SHOPPING_MODULE}`, addToCart,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}

export const deleteCartItemById = (cartItemId: number) => {
    return axios.delete(`${SHOPPING_MODULE}/${cartItemId}`)
        .then(res => {
            return res;
        })
}

export const updateQuantity = (updateInfo: updateCartItemQuantity) => {
    return axios.patch(`${SHOPPING_MODULE}/${updateInfo.cartItemId}`,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}


export const getCartList = () => {
    return axios.get(`${SHOPPING_MODULE}`)
        .then(res => {
            return res;
        })
}

export const submitOrder = (submit: submitOrderInfo) => {
    return axios.post(`${SHOPPING_MODULE}/checkout`)
        .then(res => {
            return res;
        })
}

export const startPay = (orderId: string) => {
    return axios.post(`/api/orders/${orderId}/pay`)
        .then(res => {
            return res;
        })
}



