// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyB7-uNW5HaIPTP3P0A9q6g7nK0FjMmmdtM',
    authDomain: 'maskan-fa.firebaseapp.com',
    projectId: 'maskan-fa',
    storageBucket: 'maskan-fa.appspot.com',
    messagingSenderId: '715523615713',
    appId: '1:715523615713:web:f238e3d150baf71d3500a0',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)

const auth = getAuth()

// Sign up with email and password
export const signUpUserWithEmailandPassword = async (
    email: string,
    password: string,
    displayName: string
) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        )
        const userData = userCredential.user

        updateProfile(auth.currentUser!, { displayName })
    } catch (error) {
        console.log(error)
    }
}
