import { useState, useEffect } from 'react'

import { User } from 'firebase/auth'

import { auth } from '../firebase/firebase'
import Loader from '../components/loader.component'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {
    const navigate = useNavigate()
    const [userCredentials, setUserCredentials] = useState<User | null>(null)

    useEffect(() => {
        const unSubscribeGoogleAuthObserver = auth.onAuthStateChanged(
            userAuth => {
                if (userAuth) {
                    setUserCredentials(userAuth)
                } else {
                    navigate('/login')
                    setUserCredentials(null)
                }
                console.log(userAuth)
            }
        )

        return () => unSubscribeGoogleAuthObserver()
    }, [navigate])

    const signOut = () => {
        auth.signOut()
    }

    return userCredentials ? (
        <div className="profile">
            <header className="profileHeader">
                <p className="pageHeader">حساب کاربری</p>
                <button onClick={signOut} className="logOut">
                    خروج
                </button>
            </header>
        </div>
    ) : (
        <Loader loadingState={true} />
    )
}

export default ProfilePage
