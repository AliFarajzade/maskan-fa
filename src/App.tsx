import RoutesManager from './routes/router'
import Navbar from './components/navbar.components'
import { ToastContainer } from 'react-toastify'

const App = () => {
    return (
        <>
            <RoutesManager />
            <Navbar />
            <ToastContainer
                position="top-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    )
}

export default App
