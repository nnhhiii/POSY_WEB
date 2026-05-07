// utils/orderStatus.ts

export function getStatusClass(status: string) {
    switch (status) {
        case "WAITING":
            return "bg-yellow-100 text-yellow-700";

        case "PREPARING":
            return "bg-indigo-100 text-indigo-700";

        case "SERVING":
            return "bg-blue-100 text-blue-700";

        case "SERVED":
            return "bg-cyan-100 text-cyan-700";

        case "COMPLETED":
        case "DONE":
            return "bg-green-100 text-green-700";

        case "CANCELLED":
            return "bg-red-100 text-red-700";

        default:
            return "bg-gray-200 text-gray-600";
    }
}

export function getStatusLabel(status: string) {
    switch (status) {
        case "WAITING":
            return "Waiting";
        case "PENDING":
            return "Pending";
        case "PREPARING":
            return "Preparing";
        case "SERVING":
            return "Serving";
        case "SERVED":
            return "Served";
        case "COMPLETED":
            return "Completed";
        case "DONE":
            return "Done";
        case "CANCELLED":
            return "Cancelled";
        case "NEW":
            return "Just added";
        default:
            return status;
    }
}