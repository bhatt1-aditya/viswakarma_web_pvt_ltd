export const ROLE_CLASS_MAP = {
    admin: "bg-red-100 text-red-700",
    manager: "bg-blue-100 text-blue-700",
    staff: "bg-green-100 text-green-700",
    user: "bg-amber-100 text-amber-700",
};

export const ROLE_BADGE = [
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-amber-100 text-amber-700",
    "bg-gray-100 text-gray-600",
    "bg-red-100 text-red-700",
];

export const getRoleBadgeClass = (role = "") => {
    if (!role) return ROLE_BADGE[0];

    const key = role.toLowerCase();
    if (ROLE_CLASS_MAP[key]) {
        return ROLE_CLASS_MAP[key];
    }
    let hash = 0;
    for (let i = 0; i < role.length; i++) {
        hash = role.charCodeAt(i) + ((hash << 5) - hash);
    }

    return ROLE_BADGE[Math.abs(hash) % ROLE_BADGE.length];
};