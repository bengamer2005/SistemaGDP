import { useState, useRef } from "react"
import { Package, MapPin } from "lucide-react"
import type { Order } from "../types/ordersTypes"

interface OrderKanbanViewProps {
    orders: Order[]
    onOrderClick: (order: Order) => void
    onStatusChange: (orderId: number, newStatus: number) => void
}

interface Column {
    status_id: number
    title: string
    color: string
    bgColor: string
}

const columns: Column[] = [
    { status_id: 1, title: "Pendientes", color: "#E7E79D", bgColor: "rgba(231, 231, 157, 0.1)" },
    { status_id: 2, title: "Procesando", color: "#C0D890", bgColor: "rgba(192, 216, 144, 0.1)" },
    { status_id: 3, title: "Enviado", color: "#78A890", bgColor: "rgba(120, 168, 144, 0.1)" },
    { status_id: 4, title: "Entregado", color: "#606078", bgColor: "rgba(96, 96, 120, 0.1)" },
]

const OrderKanbanView = ({ orders, onOrderClick }: OrderKanbanViewProps) => {
    const [scrollPosition, setScrollPosition] = useState(0)
    const kanbanRef = useRef<HTMLDivElement>(null)

    const getOrdersByStatus = (statusId: number) => {
        return orders.filter(order => order.order_status_id === statusId)
    }

    const formatPrice = (price: number | string) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(numPrice)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("es-MX", { 
            day: "2-digit", 
            month: "short"
        })
    }

    return (
        <div className="relative">
            {/* Kanban Board */}
            <div
                ref={kanbanRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 items-start"
                onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
            >
                {columns.map((column) => {
                    const columnOrders = getOrdersByStatus(column.status_id)

                    return (
                        <div
                            key={column.status_id}
                            className="flex-1 min-w-[255px] max-w-full bg-gray-50 rounded-xl p-4"
                        >
                            {/* Column Header */}
                            <div
                                className="px-4 py-3 rounded-t-xl border-b-2 flex items-center justify-between mb-4"
                                style={{
                                    backgroundColor: column.bgColor,
                                    borderBottomColor: column.color
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: column.color }}
                                    ></span>
                                    <span className="font-semibold text-gray-900 text-sm">
                                        {column.title}
                                    </span>
                                </div>
                                <span className="bg-white px-2.5 py-1 rounded-full text-xs font-bold text-gray-700">
                                    {columnOrders.length}
                                </span>
                            </div>

                            {/* Cards */}
                            <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin pr-2">
                                {columnOrders.map((order) => (
                                    <div
                                        key={order.orders_id}
                                        onClick={() => onOrderClick(order)}
                                        className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                                    >
                                        {/* Order Number */}
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-bold text-gray-900">
                                                #{order.orders_id}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {formatDate(order.order_date)}
                                            </span>
                                        </div>

                                        {/* Client Info */}
                                        <div className="space-y-2 mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                                        {order.client_data.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {order.client_data.tel}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div className="flex items-start gap-2 mb-3">
                                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                            <p className="text-xs text-gray-600 line-clamp-2">
                                                {order.client_data.street}, {order.client_data.neighborhood}
                                            </p>
                                        </div>

                                        {/* Products Count */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <Package className="w-4 h-4 text-gray-400" />
                                            <span className="text-xs text-gray-600">
                                                {order.products.length} producto{order.products.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>

                                        {/* Total Amount */}
                                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                                            <span className="text-xs text-gray-500">Total</span>
                                            <span className="text-sm font-bold text-[#78A890]">
                                                {formatPrice(order.total_amount)}
                                            </span>
                                        </div>

                                        {/* Notes Indicator */}
                                        {order.notes && (
                                            <div className="mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                                📝 Con notas
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Empty State */}
                                {columnOrders.length === 0 && (
                                    <div className="text-center py-8 text-gray-400">
                                        <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                        <p className="text-sm">Sin pedidos</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Custom Scrollbar Styles */}
            <style>{`
                .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: #D1D5DB;
                    border-radius: 3px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: #9CA3AF;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    )
}

export default OrderKanbanView