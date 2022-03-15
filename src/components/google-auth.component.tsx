import { useNavigate } from 'react-router-dom'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { firestore } from '../firebase/firebase'
import { toast } from 'react-toastify'
import googleIcon from '../assets/svg/googleIcon.svg'

function OAuth() {
    const navigate = useNavigate()

    const onGoogleClick = async () => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            // Check for user
            const docRef = doc(firestore, 'users', user.uid)
            const docSnap = await getDoc(docRef)

            // If user, doesn't exist, create user
            if (!docSnap.exists()) {
                await setDoc(doc(firestore, 'users', user.uid), {
                    displayName: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp(),
                })
            }
            navigate('/')
        } catch (error) {
            toast.error('عملیات انحام نشد.')
        }
    }

    return (
        <div className="socialLogin">
            <p>ورود با </p>
            <button className="socialIconDiv" onClick={onGoogleClick}>
                <img className="socialIconImg" src={googleIcon} alt="google" />
            </button>
        </div>
    )
}

export default OAuth
