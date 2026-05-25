import { mockUsers } from "./mockUsers";

export function mockLogin(email, password) {
  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
