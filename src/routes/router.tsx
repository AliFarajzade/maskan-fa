import { Routes, Route } from 'react-router-dom'

import ProfilePage from '../pages/profile.page'
import ExplorePage from '../pages/explore.page'
import SignInPage from '../pages/sign-in.page'
import SignUpPage from '../pages/sign-up.page'
import OffersPage from '../pages/offers.page'
import ForgotPasswordPage from '../pages/forgot-password.page'
import NotFoundPage from '../pages/not-found.page'
import CategoryPage from '../pages/category.page'

const RoutesManager = () => {
    return (
        <Routes>
            <Route path="/" element={<ExplorePage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/login" element={<SignInPage />} />
            <Route path="/register" element={<SignUpPage />} />
            <Route path="/reset" element={<ForgotPasswordPage />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/*" element={<NotFoundPage />} />
        </Routes>
    )
}

export default RoutesManager
