import http from 'http';
import { customers, orders } from './data.js';
const app = http.createServer((request, response) => {
    const url = request.url
    const method = request.method

    let data = ["apple", "banana", "cherry"]

    //B1: lấy ra danh sách customers /customers GET
    if (url === "/customers" && method === "GET") {
        response.end(JSON.stringify(customers))
        return
    }

    // B3: lấy ra orders của 1 khách hàng GET /customers/:customerId/orders
    if (url.startsWith("/customers/") && url.endsWith("/orders") && method === "GET") {
        const customerId = url.split("/")[2]
        const ordersOfCustomer = orders.filter(order => order.customerId === customerId)
        if (ordersOfCustomer.length > 0) {
            response.end(JSON.stringify(ordersOfCustomer))
        } else {
            response.end(JSON.stringify({ message: 'Không có đơn hàng cho khách hàng này' }))
        }
        return
    }

    //B2: lấy ra thông tin chi tiết của 1 khách hàng GET /customers/:id
    //  /customers/c001
    if (url.startsWith("/customers/") && method === "GET") {
        const customerId = url.split("/")[2]
        const customer = customers.find(customer => customer.id === customerId)
        if (customer) {
            response.end(JSON.stringify(customer))
        } else {
            response.end(JSON.stringify({ message: 'Khách hàng không tồn tại' }))
        }
        return
    }



    //response default
    response.end(JSON.stringify({ message: 'Hello World' }))
});


app.listen(3003, () => {
    console.log('Server is Running on port 3003');
})