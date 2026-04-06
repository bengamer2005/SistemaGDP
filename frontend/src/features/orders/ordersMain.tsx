import { useState } from "react"
import { Calendar } from "lucide-react"
import OrderStats from "./components/ordersStats"
import OrderControls from "./components/ordersControls"
import OrderKanbanView from "./components/ordersKanbanView"
import OrderTableView from "./components/ordersTableView"
import OrderDetailsModal from "./components/ordersDetailModal"
import OrderFormModal from "./components/ordersFormModal"
import OrderStatusModal from "./components/ordersStatusModal"
import { useAllOrders } from "./hooks/userAllOrdersService" 
import type { Order } from "./types/ordersTypes"

type ViewTab = "all" | "today" | "calendar"

const OrdersMain = () => {
    const { data: orders, isLoading, isError } = useAllOrders()

    // Estados principales
    const [activeTab, setActiveTab] = useState<ViewTab>("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban")
    const [statusFilter, setStatusFilter] = useState("all")
    
    // Estados de modales
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [showFormModal, setShowFormModal] = useState(false)
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [formMode, setFormMode] = useState<"create" | "edit">("create")
    
    // Paginación
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Filtrar órdenes según la tab activa
    const getFilteredOrdersByTab = () => {
        if (!orders) return []

        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        switch (activeTab) {
            case "today":
                return orders.filter(order => {
                    const deliveryDate = new Date(order.delivery_date)
                    const orderDate = new Date(deliveryDate.getFullYear(), deliveryDate.getMonth(), deliveryDate.getDate())
                    return orderDate.getTime() === today.getTime()
                })
            case "calendar":
                // TODO: Implementar vista de calendario
                return orders
            default:
                return orders
        }
    }

    // Aplicar búsqueda
    const filteredOrders = getFilteredOrdersByTab().filter(order =>
        order.orders_id.toString().includes(searchTerm) ||
        order.client_data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.client_data.tel.includes(searchTerm)
    )

    // Aplicar filtro de estado (solo en tabla)
    const finalOrders = viewMode === "table" && statusFilter !== "all"
        ? filteredOrders.filter(order => order.status === statusFilter)
        : filteredOrders

    // Paginación
    const totalPages = Math.ceil(finalOrders.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedOrders = viewMode === "table" ? finalOrders.slice(startIndex, endIndex) : finalOrders

    // Handlers
    const handleSearchChange = (value: string) => {
        setSearchTerm(value)
        setCurrentPage(1)
    }

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order)
        setShowDetailsModal(true)
    }

    const handleEditOrder = (order: Order) => {
        setSelectedOrder(order)
        setFormMode("edit")
        setShowDetailsModal(false)
        setShowFormModal(true)
    }

    const handleCreateOrder = () => {
        setSelectedOrder(null)
        setFormMode("create")
        setShowFormModal(true)
    }

    const handleChangeStatus = (order: Order) => {
        setSelectedOrder(order)
        setShowDetailsModal(false)
        setShowStatusModal(true)
    }

    const handleStatusFilterChange = (status: string) => {
        setStatusFilter(status)
        setCurrentPage(1)
    }

    return (
        <div className="space-y-6">
            {/* Tabs de navegación */}
            <div className="flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("all")}
                    className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
                        activeTab === "all"
                            ? "border-[#78A890] text-[#78A890]"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                >
                    Todos los Pedidos
                </button>
                <button
                    onClick={() => setActiveTab("today")}
                    className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
                        activeTab === "today"
                            ? "border-[#78A890] text-[#78A890]"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                >
                    Pedidos de Hoy
                </button>
                <button
                    onClick={() => setActiveTab("calendar")}
                    className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
                        activeTab === "calendar"
                            ? "border-[#78A890] text-[#78A890]"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                >
                    <Calendar className="w-4 h-4" />
                    Calendario
                </button>
            </div>

            {/* Estadísticas */}
            <OrderStats orders={finalOrders} />

            {/* Controles */}
            <OrderControls
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                statusFilter={statusFilter}
                onStatusFilterChange={handleStatusFilterChange}
                onCreateOrder={handleCreateOrder}
                showStatusFilter={viewMode === "table"}
            />

            {/* Vista Kanban o Tabla */}
            {activeTab === "calendar" ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Vista de calendario próximamente</p>
                </div>
            ) : viewMode === "kanban" ? (
                <OrderKanbanView
                    orders={paginatedOrders}
                    onOrderClick={handleViewOrder}
                    onStatusChange={(orderId, statusId) => {
                        // TODO: Implementar cambio de estado
                        console.log("Cambiar estado", orderId, statusId)
                    }}
                />
            ) : (
                <OrderTableView
                    orders={paginatedOrders}
                    onViewOrder={handleViewOrder}
                    onEditOrder={handleEditOrder}
                    isLoading={isLoading}
                    isError={isError}
                    pagination={{
                        currentPage,
                        totalPages,
                        onPageChange: setCurrentPage,
                        itemsPerPage,
                        totalItems: finalOrders.length
                    }}
                />
            )}

            {/* Modales */}
            <OrderDetailsModal
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                order={selectedOrder}
                onEdit={handleEditOrder}
                onChangeStatus={handleChangeStatus}
            />

            <OrderFormModal
                isOpen={showFormModal}
                onClose={() => setShowFormModal(false)}
                order={selectedOrder}
                mode={formMode}
            />
 
            <OrderStatusModal
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                order={selectedOrder}
            />
        </div>
    )
}

export default OrdersMain