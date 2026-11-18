import React from "react";

const TableSkeleton = ({ rows = 10 }) => {
    return (
        <>
            {[...Array(rows)].map((_, i) => (
                <tr key={i} className="border-b border-gray-100">

                    {/* Id */}
                    <td className="px-4 py-3">
                        <div className="h-3 w-4 bg-gray-200 rounded"></div>
                    </td>
                    {/* Member */}
                    <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-gray-200" />
                            <div className="flex flex-col gap-1">
                                <div className="h-3 w-24 bg-gray-200 rounded" />
                                <div className="h-2 w-32 bg-gray-100 rounded" />
                            </div>
                        </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                        <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3">
                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                    </td>

                    {/* Permissions */}
                    <td className="px-4 py-3">
                        <div className="flex gap-1">
                            <div className="h-4 w-10 bg-gray-200 rounded-full animate-pulse" />
                            <div className="h-4 w-8 bg-gray-100 rounded-full animate-pulse" />
                        </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                            <div className="w-7 h-7 bg-gray-200 rounded-lg animate-pulse" />
                            <div className="w-7 h-7 bg-gray-200 rounded-lg animate-pulse" />
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );
};

export default TableSkeleton;