import { Plus, Search, LayoutGrid, List, Filter } from "lucide-react"

interface OrderControlsProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    viewMode: "kanban" | "table"
    onViewModeChange: (mode: "kanban" | "table") => void
    statusFilter: string
    onStatusFilterChange: (status: string) => void
    onCreateOrder: () => void
    showStatusFilter?: boolean
}

const OrderControls = ({
    searchTerm,
    onSearchChange,
    viewMode,
    onViewModeChange,
    statusFilter,
    onStatusFilterChange,
    onCreateOrder,
    showStatusFilter = false
}: OrderControlsProps) => {
    const statusOptions = [
        { value: "all", label: "Todos" },
        { value: "Pendiente", label: "Pendientes" },
        { value: "En Proceso", label: "En Proceso" },
        { value: "Completado", label: "Completados" },
        { value: "Cancelado", label: "Cancelados" }
    ]

    return (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            {/* Left Side: Search + Filters */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por cliente, teléfono o no° pedido..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#78A890] focus:ring-3 focus:ring-[#78A890]/10 transition-all"
                    />
                </div>

                {/* Status Filter (only in table mode) */}
                {showStatusFilter && (
                    <div className="relative min-w-[180px]">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <select
                            value={statusFilter}
                            onChange={(e) => onStatusFilterChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#78A890] focus:ring-3 focus:ring-[#78A890]/10 transition-all appearance-none bg-white cursor-pointer"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Side: View Toggle + Create Button */}
            <div className="flex gap-3 w-full sm:w-auto">
                {/* View Mode Toggle */}
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => onViewModeChange("kanban")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                            viewMode === "kanban"
                                ? "bg-white text-[#78A890] shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        Kanban
                    </button>
                    <button
                        onClick={() => onViewModeChange("table")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                            viewMode === "table"
                                ? "bg-white text-[#78A890] shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        <List className="w-4 h-4" />
                        Tabla
                    </button>
                </div>

                {/* Create Order Button */}
                <button
                    onClick={onCreateOrder}
                    className="px-6 py-3 bg-gradient-to-r from-[#78A890] to-[#C0D890] text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Nuevo Pedido</span>
                </button>
            </div>
        </div>
    )
}

export default OrderControls