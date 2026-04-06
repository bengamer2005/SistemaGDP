import { Eye, Edit2 } from "lucide-react"
import GenericTable, { type Column, type TableAction } from "../../../shared/components/ui/genericTable"
import type { Order } from "../types/ordersTypes"

interface OrderTableViewProps {
    orders: Order[]
    onViewOrder: (order: Order) => void
    onEditOrder: (order: Order) => void
    isLoading: boolean
    isError: boolean
    pagination: {
        currentPage: number
        totalPages: number
        onPageChange: (page: number) => void
        itemsPerPage: number
        totalItems: number
    }
}

const OrderTableView = ({
    orders,
    onViewOrder,
    onEditOrder,
    isLoading,
    isError,
    pagination
}: OrderTableViewProps) => {

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
            month: "short",
            year: "numeric"
        })
    }

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { bg: string; text: string }> = {
            "Pendiente": { bg: "bg-[#E7E79D]/20", text: "text-[#9D9D00]" },
            "En Proceso": { bg: "bg-[#C0D890]/20", text: "text-[#6B8E23]" },
            "Completado": { bg: "bg-[#78A890]/20", text: "text-[#2F5F4F]" },
            "Cancelado": { bg: "bg-[#606078]/20", text: "text-[#606078]" },
        }

        const config = statusConfig[status] || statusConfig["Pendiente"]

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${config.bg} ${config.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${config.text.replace('text-', 'bg-')}`}></span>
                {status}
            </span>
        )
    }

    const columns: Column<Order>[] = [
        {
            key: "orders_id",
            header: "Pedido",
            render: (order) => (
                <span className="font-semibold text-gray-900">
                    #{order.orders_id}
                </span>
            )
        },
        {
            key: "client",
            header: "Cliente",
            render: (order) => (
                <div className="flex items-center gap-3">
                    <div>
                        <p className="font-semibold text-gray-900">{order.client_data.name}</p>
                        <p className="text-xs text-gray-500">{order.client_data.tel}</p>
                    </div>
                </div>
            )
        },
        {
            key: "products",
            header: "Productos",
            align: "center",
            render: (order) => (
                <span className="text-gray-900 font-medium">
                    {order.products.length}
                </span>
            )
        },
        {
            key: "total_amount",
            header: "Total",
            align: "right",
            render: (order) => (
                <span className="font-bold text-[#78A890]">
                    {formatPrice(order.total_amount)}
                </span>
            )
        },
        {
            key: "status",
            header: "Estado",
            align: "center",
            render: (order) => getStatusBadge(order.status)
        },
        {
            key: "order_date",
            header: "Fecha",
            render: (order) => (
                <span className="text-gray-600 text-sm">
                    {formatDate(order.order_date)}
                </span>
            )
        }
    ]

    const actions: TableAction<Order>[] = [
        {
            icon: <Eye className="w-4 h-4" />,
            label: "Ver detalles",
            onClick: onViewOrder,
            variant: "primary"
        },
        {
            icon: <Edit2 className="w-4 h-4" />,
            label: "Editar",
            onClick: onEditOrder,
            variant: "primary"
        }
    ]

    return (
        <GenericTable
            data={orders}
            columns={columns}
            actions={actions}
            keyExtractor={(order) => order.orders_id}
            pagination={pagination}
            isLoading={isLoading}
            isError={isError}
            emptyMessage="No se encontraron pedidos"
            errorMessage="Error al cargar los pedidos"
        />
    )
}

export default OrderTableView