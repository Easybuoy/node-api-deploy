const express = require("express");

require("dotenv").config();

let Users = require("./data/users");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "success", message: "Welcome to Node API!!!" });
});

app.get("/api/users", (req, res) => {
  if (Users.length === 0) {
    return res
      .status(404)
      .json({ status: "error", message: "Users Not Found" });
  }
  return res.json({ status: "success", data: Users });
});

app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const user = Users.find(user => user.id == id);
  if (!user) {
    return res.status(404).json({ status: "error", message: "User Not Found" });
  }

  res.json({ status: "success", data: user });
});

app.post("/api/users", (req, res) => {
  const { firstName, lastName } = req.body;

  if (!firstName && !lastName) {
    return res.status(400).json({
      status: "error",
      message: "FirstName and LastName field required"
    });
  }
  const payload = { id: Users.length + 1, firstName, lastName };
  Users = Users.concat(payload);

  return res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: Users
  });
});

app.put("/api/users/:id", (req, res) => {
  const { firstName, lastName } = req.body;
  const { id } = req.params;

  if (!firstName && !lastName) {
    return res.status(400).json({
      status: "error",
      message: "FirstName and LastName field required"
    });
  }

  const user = Users.find(user => user.id == id);
  if (!user) {
    return res.status(404).json({ status: "error", message: "User Not Found" });
  }

  Users = Users.map(user => {
    if (user.id == id) {
      user.firstName = firstName;
      user.lastName = lastName;
    }
    return user;
  });

  return res.json({
    status: "success",
    message: "User updated successfully"
  });
});

app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  const user = Users.find(user => user.id == id);
  if (!user) {
    return res.status(404).json({ status: "error", message: "User Not Found" });
  }

  Users = Users.filter(user => user.id != id);
  return res.json({ status: "success", message: "User deleted successfully" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
