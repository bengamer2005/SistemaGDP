import { Package, Clock, CheckCircle2 } from "lucide-react"
import type { Order } from "../types/ordersTypes"

interface OrderStatsProps {
    orders: Order[]
}

const OrderStats = ({ orders }: OrderStatsProps) => {
    // Calcular estadísticas
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === "Pendiente").length,
        inProgress: orders.filter(o => o.status === "En Proceso").length,
        completed: orders.filter(o => o.status === "Completado").length,
        cancelled: orders.filter(o => o.status === "Cancelado").length,
        totalRevenue: orders
            .filter(o => o.status === "Completado")
            .reduce((sum, o) => sum + parseFloat(String(o.total_amount)), 0)
    }

    const statCards = [
        {
            label: "Total Pedidos",
            value: stats.total,
            icon: Package,
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            label: "Pendientes",
            value: stats.pending,
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50"
        },
        {
            label: "En Proceso",
            value: stats.inProgress,
            icon: Package,
            color: "text-[#78A890]",
            bgColor: "bg-[#78A890]/10"
        },
        {
            label: "Completados",
            value: stats.completed,
            icon: CheckCircle2,
            color: "text-green-600",
            bgColor: "bg-green-50"
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => {
                const Icon = stat.icon

                return (
                    <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span className={`text-3xl font-bold ${stat.color}`}>
                                {stat.value}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">
                            {stat.label}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}

export default OrderStats