import React from "react";

const LeadSkeletonBody = ({ rows = 10 }) => {
    return (
        <>
            {[...Array(rows)].map((_, i) => (
                <tr key={i} className="border-b border-gray-100 animate-pulse">
                    <td className="px-4 py-3">
                        <div className="h-3 w-4 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-4 py-3">
                        <div className="h-3 w-4 bg-gray-200 rounded"></div>
                    </td>

                    <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                            <div className="space-y-1">
                                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                                <div className="h-2 w-16 bg-gray-100 rounded"></div>
                            </div>
                        </div>
                    </td>

                    <td className="px-4 py-3">
                        <div className="h-3 w-20 bg-gray-200 rounded"></div>
                    </td>

                    <td className="px-4 py-3">
                        <div className="h-3 w-24 bg-gray-200 rounded"></div>
                    </td>

                    <td className="px-4 py-3">
                        <div className="h-3 w-28 bg-gray-200 rounded"></div>
                    </td>

                    <td className="px-4 py-3">
                        <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                    </td>
                    <td className="px-4 py-3">
                        <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                    </td>

                    <td className="px-4 py-3 flex gap-2 justify-end">
                        <div className="w-7 h-7 bg-gray-200 rounded-lg"></div>
                        <div className="w-7 h-7 bg-gray-200 rounded-lg"></div>
                        <div className="w-7 h-7 bg-gray-200 rounded-lg"></div>
                    </td>
                </tr>
            ))}
        </>
    );
};

export default LeadSkeletonBody;