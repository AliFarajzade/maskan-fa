import { initializeApp } from 'firebase/app'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth'

import { doc, setDoc, serverTimestamp, getFirestore } from 'firebase/firestore'

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

export const auth = getAuth()

const firestore = getFirestore()

// Sign up with email and password
export const signUpUserWithEmailandPassword = async (
    email: string,
    password: string,
    displayName: string
) => {
    try {
        const { user } = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        )

        await updateProfile(user, { displayName })

        console.log('firebase userData:', user)

        return {
            displayName: user.displayName,
            email: user.email,
            uid: user.uid,
            timestamp: serverTimestamp(),
        }
    } catch (error: any) {
        console.log(error.code)
        return error.code
    }
}

export const signInUserWithEmailandPassword = async (
    email: string,
    password: string
) => {
    try {
        await signInWithEmailAndPassword(auth, email, password)

        return true
    } catch (error: any) {
        console.log(error.code)
        return error.code
    }
}

// Setting document on given collection name
export const setDocOnFirestore = async (
    dataToSet: any,
    collectionName: string,
    pathSegment: string
) => {
    await setDoc(doc(firestore, collectionName, pathSegment), dataToSet)
}
