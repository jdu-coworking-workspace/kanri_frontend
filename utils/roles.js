export const USER_ROLES = Object.freeze({
  STAFF: "staff",
  ADMIN: "admin",
});

export function normalizeRole(role) {
  if (role == null) return "";
  return String(role).trim().toLowerCase();
}

export function isAdminRole(role) {
  return normalizeRole(role) === USER_ROLES.ADMIN;
}

export function isStaffRole(role) {
  return normalizeRole(role) === USER_ROLES.STAFF;
}

export function normalizeUser(user) {
  if (!user || typeof user !== "object" || Array.isArray(user)) return user;
  if (user.role == null || user.role === "") return user;
  const role = normalizeRole(user.role);
  if (role === user.role) return user;
  return { ...user, role };
}
