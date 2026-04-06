import GenericTable from "../../../shared/components/ui/genericTable"
// types
import type { Products } from "../types/productsTypes"
import type { Column } from "../../../shared/components/ui/genericTable"
import type { GenericTableProps } from "../../../shared/components/ui/genericTable"

interface ProductsTableProps {
    data: Products[]
    isLoading: boolean
    isError: boolean
    searchTerm: string
    pagination: GenericTableProps<Products>["pagination"]
}

const ProductsTable = ({ data, isLoading, isError, searchTerm, pagination }: ProductsTableProps) => {

    // table 
    const columns: Column<Products>[] = [
        {
            key: "name",
            header: "Producto",
            render: (product) => <span className="font-semibold text-gray-900">{product.name}</span>
        },
        {
            key: "price_cost",
            header: "Precio Costo",
            render: (product) => <span className="font-semibold text-gray-900">{product.price_cost}</span>
        },
        {
            key: "price_sale",
            header: "Precio Venta",
            render: (product) => <span className="font-semibold text-gray-900">{product.price_sale}</span>
        },
        {
            key: "price_wholesale",
            header: "Precio Mayoreo",
            render: (product) => product.price_wholesale 
                ? <span className="font-semibold text-gray-900">{product.price_wholesale}</span>
                : <span className="text-gray-400 italic">No definido</span>
        },
        {
            key: "inventory",
            header: "Inventario",
            render: (product) => <span className="font-semibold text-gray-900">{product.inventory}</span>
        },
        {
            key: "inventory_min",
            header: "Inventario Min",
            render: (product) => <span className="font-semibold text-gray-900">{product.inventory_min}</span>
        }
    ]

    return (
        <GenericTable
            data={data}
            columns={columns}
            keyExtractor={(product) => product.products_id}

            isLoading={isLoading}
            isError={isError}

            emptyMessage={
                searchTerm
                    ? "No se encontraron producros con ese criterio de búsqueda."
                    : "No se encontraron productos."
            }
            emptyType={searchTerm ? "info" : "warning"}
            errorMessage="Ocurrió un error al cargar los productos. Por favor, intenta nuevamente."

            pagination={{
                currentPage: pagination.currentPage,
                totalPages: pagination.totalPages,
                onPageChange: pagination?.onPageChange,
                itemsPerPage: pagination.itemsPerPage,
                totalItems: pagination.totalItems
            }}
        />
    )
}

export default ProductsTable