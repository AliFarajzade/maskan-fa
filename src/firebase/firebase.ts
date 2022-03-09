import { initializeApp } from 'firebase/app'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    updateEmail,
    sendPasswordResetEmail,
} from 'firebase/auth'

import {
    doc,
    setDoc,
    serverTimestamp,
    getFirestore,
    updateDoc,
} from 'firebase/firestore'

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

// Change name
export const changeProfileName = async (newName: string) => {
    try {
        // Change name in auth
        await updateProfile(auth.currentUser!, { displayName: newName })
    } catch (error: any) {
        console.log(error.code)
        return error.code
    }

    try {
        // Change name in Firestore
        await updateDoc(doc(firestore, 'users', auth.currentUser!.uid), {
            displayName: newName,
            lastUpdated: serverTimestamp(),
        })
    } catch (error: any) {
        console.log(error.code)
        return error.code
    }
}

export const changeProfileEmail = async (newEmail: string) => {
    try {
        // Change email in auth
        await updateEmail(auth.currentUser!, newEmail)
    } catch (error: any) {
        console.log(error.code)
        return error.code
    }

    try {
        // Change email in Firestore
        await updateDoc(doc(firestore, 'users', auth.currentUser!.uid), {
            email: newEmail,
            lastUpdated: serverTimestamp(),
        })
    } catch (error: any) {
        console.log(error.code)
        return error.code
    }
}

export const recoverPassword = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
        console.log(error.code)
        return error.code
    }
}
