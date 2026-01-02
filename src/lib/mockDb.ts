import bcrypt from "bcryptjs";

type User = {
  id: string;
  username: string;
  passwordHash: string;
};

const users: User[] = [
  {
    id: "1",
    username: "admin",
    passwordHash: bcrypt.hashSync("password123", 8),
  },
  // add more seeded users as needed
];

export function findUserByUsername(username: string) {
  return users.find((u) => u.username === username) || null;
}

export function findUserById(id: string) {
  return users.find((u) => u.id === id) || null;
}
