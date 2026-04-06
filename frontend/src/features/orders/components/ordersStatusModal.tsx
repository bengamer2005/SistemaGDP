import { useState, useEffect } from "react"
import { Clock, AlertCircle, CheckCircle2, XCircle, Package, Truck, Forklift } from "lucide-react"
import GenericModal from "../../../shared/components/ui/genericModal"
import { useOrderStatuses, useChangeOrderStatus } from "../hooks/userAllOrdersService"
import type { Order } from "../types/ordersTypes"
import { toast } from "sonner"

interface OrderStatusModalProps {
    isOpen: boolean
    onClose: () => void
    order: Order | null
}

const OrderStatusModal = ({ isOpen, onClose, order }: OrderStatusModalProps) => {
    const { data: statuses, isLoading: loadingStatuses } = useOrderStatuses()
    const changeStatusMutation = useChangeOrderStatus()

    const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null)
    const [notes, setNotes] = useState("")

    useEffect(() => {
        if (order && isOpen) {
            setSelectedStatusId(order.order_status_id)
            setNotes("")
        }
    }, [order, isOpen])

    if (!order) return null

    const handleSubmit = async () => {
        if(!selectedStatusId) return

        if(selectedStatusId === 5 && !notes.length) return toast.warning("Las notas es un campo obligatorio para cancelar una solicitud")
        
        if(selectedStatusId === 5 && order.order_status_id === 4) return toast.error("Los pedidos entregados no se pueden marcar como cancelados")

        await changeStatusMutation.mutateAsync({
            orderId: order.orders_id,
            statusId: selectedStatusId,
            notes: notes.trim() || undefined
        })

        onClose()
    }

    const getStatusIcon = (statusName: string) => {
        const icons: Record<string, React.ReactNode> = {
            "Pendiente": <Clock className="w-5 h-5" />,
            "Procesando": <Forklift className="w-5 h-5" />,
            "Enviado": <Truck className="w-5 h-5" />,
            "Entregado": <CheckCircle2 className="w-5 h-5" />,
            "Cancelado": <XCircle className="w-5 h-5" />
        }
        return icons[statusName] || <Package className="w-5 h-5" />
    }

    const getStatusColor = (statusName: string) => {
        const colors: Record<string, { bg: string; border: string; text: string }> = {
            "Pendiente": { 
                bg: "bg-[#E7E79D]/10", 
                border: "border-[#E7E79D]", 
                text: "text-[#9D9D00]" 
            },
            "En Proceso": { 
                bg: "bg-[#C0D890]/10", 
                border: "border-[#C0D890]", 
                text: "text-[#6B8E23]" 
            },
            "Completado": { 
                bg: "bg-[#78A890]/10", 
                border: "border-[#78A890]", 
                text: "text-[#2F5F4F]" 
            },
            "Cancelado": { 
                bg: "bg-[#606078]/10", 
                border: "border-[#606078]", 
                text: "text-[#606078]" 
            }
        }
        return colors[statusName] || colors["Pendiente"]
    }

    const actions = [
        {
            label: "Cancelar",
            onClick: onClose,
            variant: "secondary" as const
        },
        {
            label: "Actualizar Estado",
            onClick: handleSubmit,
            variant: "primary" as const,
            loading: changeStatusMutation.isPending,
            disabled: !selectedStatusId || selectedStatusId === order.order_status_id
        }
    ]

    return (
        <GenericModal
            isOpen={isOpen}
            onClose={onClose}
            title="Cambiar Estado del Pedido"
            description={`Pedido #${order.orders_id} - ${order.client_data.name}`}
            actions={actions}
            size="md"
        >
            <>
                {/* Current Status */}
                <div className="mb-6">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Estado Actual
                    </h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 ${getStatusColor(order.status).bg} rounded-xl flex items-center justify-center ${getStatusColor(order.status).text}`}>
                                {getStatusIcon(order.status)}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{order.status}</p>
                                <p className="text-xs text-gray-500">Estado actual del pedido</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Options */}
                <div className="mb-6">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Seleccionar Nuevo Estado
                    </h4>

                    {loadingStatuses ? (
                        <div className="grid grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {statuses?.map((status) => {
                                const colors = getStatusColor(status.name)
                                const isSelected = selectedStatusId === status.order_status_id
                                const isCurrent = order.order_status_id === status.order_status_id

                                return (
                                    <button
                                        key={status.order_status_id}
                                        onClick={() => setSelectedStatusId(status.order_status_id)}
                                        disabled={isCurrent}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                                            isSelected
                                                ? `${colors.border} ${colors.bg} ${colors.text}`
                                                : isCurrent
                                                ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                                                : "border-gray-200 hover:border-gray-300 bg-white"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center ${colors.text}`}>
                                                {getStatusIcon(status.name)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`font-semibold text-sm ${isSelected ? colors.text : "text-gray-900"}`}>
                                                    {status.name}
                                                </p>
                                                <p className={`text-xs ${isSelected ? colors.text : "text-gray-900"}`}>
                                                    {status.description}
                                                </p>
                                            </div>
                                        </div>
                                        {isCurrent && (
                                            <span className="text-xs text-gray-500 italic">
                                                Estado actual
                                            </span>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Notes */}
                <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Notas (Opcional)
                    </h4>
                    <div className="relative">
                        <AlertCircle className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Agrega una nota sobre el cambio de estado..."
                            rows={4}
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#78A890] focus:ring-4 focus:ring-[#78A890]/10 transition-all resize-none"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Estas notas quedarán registradas en el historial del pedido
                    </p>
                </div>

                {/* Warning for certain status changes */}
                {selectedStatusId === 5 && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-red-900">
                            <p className="font-semibold mb-1">Cancelar pedido</p>
                            <p>Esta acción marcará el pedido como cancelado. Asegúrate de agregar una nota explicando el motivo.</p>
                        </div>
                    </div>
                )}
            </>
        </GenericModal>
    )
}

export default OrderStatusModal