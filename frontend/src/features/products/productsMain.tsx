import { useState } from "react"
// hooks
import { useGetAllProducts, useCreateProducts, useUploadProductsExcel } from "./hooks/useProducts"
import { useSearch } from "../../shared/hooks/useSearch"
import { usePagination } from "../../shared/hooks/usePagination"
// components
import ProductsTable from "./components/productsTable"
import ProductsToolbar from "./components/productsToolbar"
import ProductModal from "./components/productsModal"

const ProductsMain = () => {
    const { data, isLoading, isError } = useGetAllProducts()

    const [showModal, setShowModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    // filter products
    const filteredProducts = useSearch(data || [], searchTerm, (product, term) => 
        product.name.toLowerCase().includes(term.toLowerCase())
    )

    // pagination
    const {
        paginatedData,
        currentPage,
        totalPages,
        handlePageChange,
        itemsPerPage
    } = usePagination(filteredProducts)

    // create products
    const { mutate } = useCreateProducts()
    const { mutate: mutateExcel } = useUploadProductsExcel()

    return (
        <>
            <ProductsToolbar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setShowModal={setShowModal}
            />

            <ProductsTable
                data={paginatedData}
                isLoading={isLoading}
                isError={isError}
                searchTerm={searchTerm}
                pagination={{
                    currentPage,
                    totalPages,
                    onPageChange: handlePageChange,
                    itemsPerPage,
                    totalItems: filteredProducts.length
                }}
            />

            <ProductModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                createProduct={mutate}
                onUploadExcel={mutateExcel}
            />
        </>
    )
}

export default ProductsMain