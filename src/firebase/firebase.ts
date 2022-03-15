import { initializeApp } from 'firebase/app'
import { v4 as uuid } from 'uuid'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    updateEmail,
    sendPasswordResetEmail,
} from 'firebase/auth'

import {
    addDoc,
    doc,
    setDoc,
    serverTimestamp,
    getFirestore,
    updateDoc,
    collection,
    getDocs,
    getDoc,
    query,
    where,
    orderBy,
    limit,
    DocumentData,
    DocumentSnapshot,
    deleteDoc,
    startAfter,
    QuerySnapshot,
    Query,
} from 'firebase/firestore'
import { TListing } from '../types/lisiting.types'

import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage'

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

const storage = getStorage()

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
    pathSegment: string = ''
) => {
    try {
        if (pathSegment)
            await setDoc(doc(firestore, collectionName, pathSegment), dataToSet)
        else await addDoc(collection(firestore, collectionName), dataToSet)
    } catch (error: any) {
        console.log(error.code)
        return error.code
    }
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

// Getting documents from collection
export const getListingsDocuments = async (
    value: string,
    lastSnapshot: QuerySnapshot<DocumentData> | null = null
) => {
    try {
        const collectionRef = collection(firestore, 'listings')

        let q: Query<DocumentData>

        if (lastSnapshot) {
            q = query(
                collectionRef,
                where('type', '==', value),
                orderBy('timestamp', 'desc'),
                limit(2),
                startAfter(lastSnapshot)
            )
        } else {
            q = query(
                collectionRef,
                where('type', '==', value),
                orderBy('timestamp', 'desc'),
                limit(2)
            )
        }

        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty)
            return { listings: null, lastDocSnapshot: null }

        const listings: TListing[] | DocumentData | undefined = []

        const { docs: docsSnapshot } = querySnapshot

        const lastDocSnapshot =
            querySnapshot.docs[querySnapshot.docs.length - 1]

        console.log(lastDocSnapshot)

        docsSnapshot.forEach((documentSnapshot: DocumentSnapshot) =>
            listings.push({
                ...documentSnapshot.data(),
                id: documentSnapshot.id,
            })
        )

        console.log(listings)
        return { listings, lastDocSnapshot }
    } catch (error: any) {
        console.log(error.code)
        return error.code
    }
}

export const getOffers = async () => {
    try {
        const collectionRef = collection(firestore, 'listings')

        const q = query(
            collectionRef,
            where('offer', '==', true),
            orderBy('timestamp', 'desc'),
            limit(10)
        )

        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) return null

        const listings: TListing[] | DocumentData | undefined = []

        const { docs: docsSnapshot } = querySnapshot

        docsSnapshot.forEach((documentSnapshot: DocumentSnapshot) =>
            listings.push({
                ...documentSnapshot.data(),
                id: documentSnapshot.id,
            })
        )

        console.log(listings)
        return listings
    } catch (error: any) {
        console.log(error.code)
        return error.code
    }
}

export const uploadImage = async (imageFile: any) =>
    new Promise((resolve, reject) => {
        const fileName = `${auth.currentUser?.uid}-${imageFile.name}-${uuid()}`

        const storageRef = ref(storage, `images/${fileName}`)

        const uploadTask = uploadBytesResumable(storageRef, imageFile)

        uploadTask.on(
            'state_changed',
            snapshot => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                console.log('Upload is ' + progress + '% done')
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused')
                        break
                    case 'running':
                        console.log('Upload is running')
                        break
                }
            },

            (error: any) => {
                console.log(error.code)
                reject(error.code)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                    console.log('File available at', downloadURL)
                    resolve(downloadURL)
                })
            }
        )
    })

export const getDocument = async (
    collectionName: string,
    documentID: string
) => {
    try {
        const docRef = doc(firestore, collectionName, documentID)

        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            return docSnap.data()
        } else {
            return null
        }
    } catch (error: any) {
        console.log(error.code)
        return error.code
    }
}

export const getListingsForExploreSlider = async () => {
    try {
        const collectionRef = collection(firestore, 'listings')

        const q = query(collectionRef, orderBy('timestamp', 'desc'), limit(4))

        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) return null

        const listings: TListing[] | DocumentData | undefined = []

        const { docs: docsSnapshot } = querySnapshot

        docsSnapshot.forEach((documentSnapshot: DocumentSnapshot) =>
            listings.push({
                ...documentSnapshot.data(),
                id: documentSnapshot.id,
            })
        )

        console.log(listings)
        return listings
    } catch (error: any) {
        console.log(error.code)
        return error.code
    }
}

export const getUsersListings = async (
    uid: string,
    lastSnapshot: QuerySnapshot<DocumentData> | null = null
) => {
    try {
        const collectionRef = collection(firestore, 'listings')

        let q: Query<DocumentData>

        if (lastSnapshot) {
            q = query(
                collectionRef,
                where('creatorID', '==', uid),
                orderBy('timestamp', 'desc'),
                limit(2),
                startAfter(lastSnapshot)
            )
        } else {
            q = query(
                collectionRef,
                where('creatorID', '==', uid),
                orderBy('timestamp', 'desc'),
                limit(2)
            )
        }

        const querySnapshot = await getDocs(q)

        const lastDocSnapshot =
            querySnapshot.docs[querySnapshot.docs.length - 1]

        if (querySnapshot.empty)
            return { listings: null, lastDocSnapshot: null }

        const listings: TListing[] | DocumentData | undefined = []

        const { docs: docsSnapshot } = querySnapshot

        docsSnapshot.forEach((documentSnapshot: DocumentSnapshot) =>
            listings.push({
                ...documentSnapshot.data(),
                id: documentSnapshot.id,
            })
        )

        console.log(listings)
        return { listings, lastDocSnapshot }
    } catch (error: any) {
        console.log(error.code)
        return error.code
    }
}

export const deleteDocument = async (lisitingID: string) => {
    try {
        await deleteDoc(doc(firestore, '/listings', lisitingID))
    } catch (error: any) {
        console.log(error.code)
        return error.code
    }
}
