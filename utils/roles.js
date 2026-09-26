export const USER_ROLES = Object.freeze({
  STAFF: "staff",
  ADMIN: "admin",
  STUDENT: "student",
});

export function settingsPathForRole(role) {
  if (isStudentRole(role)) return "/dashboard/student-settings";
  if (isStaffRole(role)) return "/dashboard/staff-settings";
  return "/dashboard/settings";
}

export function blockedRedirect(role, pathname) {
  if (!pathname || !pathname.startsWith("/dashboard")) return null;

  if (isStudentRole(role)) {
    if (pathname === "/dashboard" || pathname === "/dashboard/student-settings") return null;
    return "/dashboard";
  }

  if (isStaffRole(role)) {
    if (pathname === "/dashboard/settings" || pathname === "/dashboard/student-settings") {
      return "/dashboard/staff-settings";
    }
    return null;
  }

  if (isAdminRole(role)) {
    if (pathname === "/dashboard/staff-settings" || pathname === "/dashboard/student-settings") {
      return "/dashboard/settings";
    }
    return null;
  }

  return null;
}

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

export function isStudentRole(role) {
  return normalizeRole(role) === USER_ROLES.STUDENT;
}

export function normalizeUser(user) {
  if (!user || typeof user !== "object" || Array.isArray(user)) return user;
  if (user.role == null || user.role === "") return user;
  const role = normalizeRole(user.role);
  if (role === user.role) return user;
  return { ...user, role };
}
