import http from 'http';

const products = [
   {
    id: 1,
    name: "Product 1",
    price: 100
   },
   {
    id: 2,
    name: "Product 2",
    price: 200
   },
   {
    id: 3,
    name: "Product 3",
    price: 300
   }
]
const users = [
    {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com"
    },
    {
        id: 2,
        name: "Jane Doe",
        email: "jane.doe@example.com"
    }
]

const app = http.createServer((request, response)=>{
    const url = request.url
    const method = request.method
    console.log("🚀 ~ method:", method)
    // /products?minPrice=100
    switch(url){
        case '/products':
            response.end(JSON.stringify(products))
            break
        case '/users':
            if(method === 'GET'){
                response.end(JSON.stringify(users))
            }
            if(method === 'POST'){
                users.push({id: 3, name: "Duyen", email: "duyen@example.com"})
                response.end(JSON.stringify(users))
            }
            break
        default:
            response.end(JSON.stringify({ message: 'Not Found' }))
            break
    }
});

app.listen(3001, () => {
    console.log('Server is Running on port 3001');
})