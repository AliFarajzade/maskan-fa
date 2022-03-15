import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Loader from '../components/loader.component'

const ProfilePage = lazy(() => import('../pages/profile.page'))
const ExplorePage = lazy(() => import('../pages/explore.page'))
const SignInPage = lazy(() => import('../pages/sign-in.page'))
const SignUpPage = lazy(() => import('../pages/sign-up.page'))
const OffersPage = lazy(() => import('../pages/offers.page'))
const ForgotPasswordPage = lazy(() => import('../pages/forgot-password.page'))
const NotFoundPage = lazy(() => import('../pages/not-found.page'))
const CategoryPage = lazy(() => import('../pages/category.page'))
const CreateListingPage = lazy(() => import('../pages/create-listing.page'))
const Listing = lazy(() => import('../pages/lisitng.page'))
const ContactPage = lazy(() => import('../pages/contact.page'))
const EditListingPage = lazy(() => import('../pages/edit-listing.page'))

const RoutesManager = () => {
    return (
        <Suspense fallback={<Loader loadingState={true} />}>
            <Routes>
                <Route path="/" element={<ExplorePage />} />
                <Route path="/offers" element={<OffersPage />} />
                <Route path="/login" element={<SignInPage />} />
                <Route path="/register" element={<SignUpPage />} />
                <Route path="/reset" element={<ForgotPasswordPage />} />
                <Route
                    path="/category/:categoryName"
                    element={<CategoryPage />}
                />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/create-listing" element={<CreateListingPage />} />
                <Route path="/contact/:landlordID" element={<ContactPage />} />
                <Route
                    path="/edit-listing/:listingID"
                    element={<EditListingPage />}
                />
                <Route
                    path="/category/:categoryName/:houseID"
                    element={<Listing />}
                />
                <Route path="/*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    )
}

export default RoutesManager
