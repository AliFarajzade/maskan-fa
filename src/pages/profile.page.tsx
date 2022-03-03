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

    return userCredentials ? (
        <h1>{userCredentials.displayName}</h1>
    ) : (
        <Loader loadingState={true} />
    )
}

export default ProfilePage
