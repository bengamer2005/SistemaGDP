import { Plus } from "lucide-react"

interface ProductsToolbarProps {
    searchTerm: string
    setSearchTerm: (value: React.SetStateAction<string>) => void
    setShowModal: (value: React.SetStateAction<boolean>) => void
}

const ProductsToolbar = ({ searchTerm, setSearchTerm, setShowModal }: ProductsToolbarProps) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md w-full">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>

                <input
                    type="text"
                    placeholder="Buscar por producto, precio o inventario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-96 pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#78A890] focus:ring-3 focus:ring-[#78A890]/10 transition-all"
                />
            </div>

            <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-[#78A890] text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Nuevo Producto
            </button>
        </div>
    )
}

export default ProductsToolbar