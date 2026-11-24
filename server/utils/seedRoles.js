import Role from "../models/role.model.js";

const DEFAULT_ROLES = [
  "super admin",
  "admin",
  "telecaller",
  "project manager",
  "developer",
  "qa tester",
  "client",
];

export const seedDefaultRoles = async () => {
  try {
    for (const roleName of DEFAULT_ROLES) {
      const exists = await Role.findOne({ name: roleName.toLowerCase() });
      if (!exists) {
        await Role.create({ name: roleName.toLowerCase() });
        console.log(`[RoleSeeder] Initialized role: ${roleName}`);
      }
    }
  } catch (error) {
    console.error("[RoleSeeder] Error initializing default roles:", error.message);
  }
};
