import {PRODUCT_MODULE, ORDER_MODULE, SHOPPING_MODULE} from "../api/_prefix";
import {axios} from "../utils/request.ts";




export const startPay = (orderId: number) => {
    return axios.post(`/api/orders/${orderId}/pay`)
        .then(res => {
            return res;
        })
}