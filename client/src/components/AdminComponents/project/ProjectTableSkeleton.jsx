import React from "react";

const ProjectTableSkeleton = ({ rows = 10 }) => {
    return (
        <>
            {[...Array(rows)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                    {/* Project */}
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        </div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                        <div className="h-4 w-20 bg-gray-200 rounded mx-auto"></div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4">
                        <div className="h-4 w-28 bg-gray-200 rounded mx-auto"></div>
                    </td>

                    {/* Media */}
                    <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                            <div className="h-4 w-10 bg-gray-200 rounded"></div>
                            <div className="h-4 w-10 bg-gray-200 rounded"></div>
                        </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                        <div className="h-4 w-16 bg-gray-200 rounded-full mx-auto"></div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                        <div className="flex gap-2 justify-end">
                            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );
};

export default ProjectTableSkeleton;