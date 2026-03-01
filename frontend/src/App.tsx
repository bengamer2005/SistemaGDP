import { BrowserRouter, Route, Routes } from "react-router"
import { Toaster } from "sonner"
// pages
import MainPage from "./pages/mainPage"
import NotFound from "./pages/404Page"
// estilos
import "./index.css"

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainPage/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </BrowserRouter>

            <Toaster 
                position="top-right"
                expand={false}
                richColors
                closeButton
                duration={3000}
            />
        </>
    )
}

export default App