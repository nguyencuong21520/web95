const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const JSON_SERVER_URL = process.env.JSON_SERVER_URL || "http://localhost:3001";

app.use(express.json());

function nextId(items, prefix) {
  const maxNum = items.reduce((max, item) => {
    const num = parseInt(String(item.id).replace(prefix, ""), 10);
    return Number.isNaN(num) ? max : Math.max(max, num);
  }, 0);
  return prefix + String(maxNum + 1).padStart(3, "0");
}

async function requestJsonServer(path, options = {}) {
  try {
    const response = await axios({
      url: `${JSON_SERVER_URL}${path}`,
      ...options,
    });
    return { ok: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response) {
      return {
        ok: false,
        status: error.response.status,
        data: error.response.data,
      };
    }
    throw error;
  }
}

app.get("/customers", async (req, res) => {
  try {
    const { ok, status, data } = await requestJsonServer("/customers");
    if (!ok) return res.status(status).json({ error: "Failed to fetch customers" });
    return res.json(data);
  } catch {
    return res.status(500).json({ error: "Cannot connect to JSON Server" });
  }
});

app.get("/customers/:id", async (req, res) => {
  try {
    const { ok, status, data } = await requestJsonServer(`/customers/${req.params.id}`);
    if (status === 404) return res.status(404).json({ error: "Customer not found" });
    if (!ok) return res.status(status).json({ error: "Failed to fetch customer" });
    return res.json(data);
  } catch {
    return res.status(500).json({ error: "Cannot connect to JSON Server" });
  }
});

app.get("/customers/:customerId/orders", async (req, res) => {
  try {
    const { ok, status, data } = await requestJsonServer(`/orders?customerId=${req.params.customerId}`);
    if (!ok) return res.status(status).json({ error: "Failed to fetch orders" });
    return res.json(data);
  } catch {
    return res.status(500).json({ error: "Cannot connect to JSON Server" });
  }
});

app.get("/orders/highvalue", async (req, res) => {
  try {
    const { ok, status, data } = await requestJsonServer("/orders");
    if (!ok) return res.status(status).json({ error: "Failed to fetch orders" });
    const highValue = data.filter((order) => order.totalPrice > 10000000);
    return res.json(highValue);
  } catch {
    return res.status(500).json({ error: "Cannot connect to JSON Server" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const { ok, status, data } = await requestJsonServer("/products");
    if (!ok) return res.status(status).json({ error: "Failed to fetch products" });

    const { minPrice, maxPrice } = req.query;
    if (!minPrice || !maxPrice) return res.json(data);

    const min = Number(minPrice);
    const max = Number(maxPrice);
    const filtered = data.filter((product) => product.price >= min && product.price <= max);
    return res.json(filtered);
  } catch {
    return res.status(500).json({ error: "Cannot connect to JSON Server" });
  }
});

app.post("/customers", async (req, res) => {
  const { name, email, age } = req.body;
  if (!name || !email || age === undefined) {
    return res.status(400).json({ error: "name, email, age are required" });
  }

  try {
    const existing = await requestJsonServer(`/customers?email=${encodeURIComponent(email)}`);
    if (!existing.ok) {
      return res.status(existing.status).json({ error: "Failed to validate customer email" });
    }
    if (existing.data.length > 0) return res.status(400).json({ error: "Email already exists" });

    const allCustomers = await requestJsonServer("/customers");
    if (!allCustomers.ok) {
      return res.status(allCustomers.status).json({ error: "Failed to generate customer id" });
    }

    const newCustomer = { id: nextId(allCustomers.data, "c"), name, email, age };
    const created = await requestJsonServer("/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: newCustomer,
    });
    if (!created.ok) return res.status(created.status).json({ error: "Failed to create customer" });
    return res.status(201).json(created.data);
  } catch {
    return res.status(500).json({ error: "Cannot connect to JSON Server" });
  }
});

app.post("/orders", async (req, res) => {
  const { customerId, productId, quantity } = req.body;
  if (!customerId || !productId || !quantity) {
    return res.status(400).json({ error: "customerId, productId, quantity are required" });
  }

  try {
    const customer = await requestJsonServer(`/customers/${customerId}`);
    if (customer.status === 404) return res.status(404).json({ error: "Customer not found" });

    const product = await requestJsonServer(`/products/${productId}`);
    if (product.status === 404) return res.status(404).json({ error: "Product not found" });
    if (!product.ok) return res.status(product.status).json({ error: "Failed to fetch product" });

    if (quantity > product.data.quantity) {
      return res.status(400).json({ error: "Quantity exceeds available stock" });
    }

    const allOrders = await requestJsonServer("/orders");
    if (!allOrders.ok) return res.status(allOrders.status).json({ error: "Failed to generate order id" });

    const newOrder = {
      id: nextId(allOrders.data, "o"),
      customerId,
      productId,
      quantity,
      totalPrice: product.data.price * quantity,
    };

    const createdOrder = await requestJsonServer("/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: newOrder,
    });
    if (!createdOrder.ok) return res.status(createdOrder.status).json({ error: "Failed to create order" });

    await requestJsonServer(`/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      data: { quantity: product.data.quantity - quantity },
    });

    return res.status(201).json(createdOrder.data);
  } catch {
    return res.status(500).json({ error: "Cannot connect to JSON Server" });
  }
});

app.put("/orders/:orderId", async (req, res) => {
  const { quantity } = req.body;
  if (!quantity) return res.status(400).json({ error: "quantity is required" });

  try {
    const order = await requestJsonServer(`/orders/${req.params.orderId}`);
    if (order.status === 404) return res.status(404).json({ error: "Order not found" });
    if (!order.ok) return res.status(order.status).json({ error: "Failed to fetch order" });

    const product = await requestJsonServer(`/products/${order.data.productId}`);
    if (product.status === 404) return res.status(404).json({ error: "Product not found" });
    if (!product.ok) return res.status(product.status).json({ error: "Failed to fetch product" });

    const updatedPayload = {
      quantity,
      totalPrice: product.data.price * quantity,
    };

    const updatedOrder = await requestJsonServer(`/orders/${req.params.orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      data: updatedPayload,
    });
    if (!updatedOrder.ok) return res.status(updatedOrder.status).json({ error: "Failed to update order" });
    return res.json(updatedOrder.data);
  } catch {
    return res.status(500).json({ error: "Cannot connect to JSON Server" });
  }
});

app.delete("/customers/:id", async (req, res) => {
  try {
    const deleted = await requestJsonServer(`/customers/${req.params.id}`, { method: "DELETE" });
    if (deleted.status === 404) return res.status(404).json({ error: "Customer not found" });
    if (!deleted.ok) return res.status(deleted.status).json({ error: "Failed to delete customer" });
    return res.json({ message: "Customer deleted successfully" });
  } catch {
    return res.status(500).json({ error: "Cannot connect to JSON Server" });
  }
});

app.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}`);
  console.log(`JSON Server target: ${JSON_SERVER_URL}`);
});
