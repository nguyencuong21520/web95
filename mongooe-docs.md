# 📦 Mongoose CRUD Cheat Sheet

## 🧱 Setup

```js
import mongoose from "mongoose";

await mongoose.connect("mongodb://127.0.0.1:27017/test");

const userSchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
    email: String,
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
```

---

## ➕ CREATE

### create()

```js
const user = await User.create({
  name: "An",
  age: 22,
  email: "an@gmail.com",
});
```

### save()

```js
const user = new User({
  name: "Binh",
  age: 25,
});

await user.save();
```

---

## 🔍 READ

### Get all

```js
const users = await User.find();
```

### Get one

```js
const user = await User.findOne({ name: "An" });
```

### Get by ID

```js
const user = await User.findById("id_here");
```

### Query condition

```js
const users = await User.find({ age: { $gt: 20 } });
```

### Select fields

```js
const users = await User.find().select("name age");
```

---

## ✏️ UPDATE

### updateOne

```js
await User.updateOne({ name: "An" }, { age: 23 });
```

### updateMany

```js
await User.updateMany({ age: { $lt: 18 } }, { age: 18 });
```

### findByIdAndUpdate

```js
const user = await User.findByIdAndUpdate(
  "id_here",
  { age: 30 },
  { new: true },
);
```

---

## ❌ DELETE

### deleteOne

```js
await User.deleteOne({ name: "An" });
```

### deleteMany

```js
await User.deleteMany({ age: { $lt: 18 } });
```

### findByIdAndDelete

```js
await User.findByIdAndDelete("id_here");
```

---

## ⚡ Extras

### Pagination

```js
const users = await User.find().skip(10).limit(5);
```

### Sort

```js
const users = await User.find().sort({ age: -1 });
```

### Count

```js
const count = await User.countDocuments();
```

---

## 🧠 Tips

- Dùng async/await
- Dùng `{ new: true }` khi update
- Validate schema (required, unique, ...)

---
