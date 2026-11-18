import React from "react";

const StaffTable = () => {
    return (
        <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm text-gray-900 font-bold">
                    Sl No
                </th>

                <th className="px-4 py-3 text-left text-sm text-gray-900 font-bold">
                    👤 Member
                </th>

                <th className="px-4 py-3 text-left text-sm text-gray-900 font-bold">
                    🛡 Role
                </th>

                <th className="px-4 py-3 text-left text-sm text-gray-900 font-bold">
                    📞 Phone
                </th>

                <th className="px-4 py-3 text-left text-sm text-gray-900 font-bold">
                    ⚙ Permissions
                </th>

                <th className="px-4 py-3 text-right text-sm text-gray-900 font-bold">
                    Actions
                </th>
            </tr>
        </thead>
    );
};

export default StaffTable;