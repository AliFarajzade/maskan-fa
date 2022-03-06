import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { User } from 'firebase/auth'

import {
    auth,
    changeProfileEmail,
    changeProfileName,
} from '../firebase/firebase'

import Loader from '../components/loader.component'

type TInputs = {
    name: string
    email: string
}

const ProfilePage = () => {
    const navigate = useNavigate()
    const [userCredentials, setUserCredentials] = useState<User | null>(null)
    const [changeUserDetailsStatus, setChangeUserDetailsStatus] =
        useState<boolean>(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TInputs>()

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

    const onSubmit: SubmitHandler<TInputs> = async data => {
        const { email, name } = data

        if (name !== userCredentials?.displayName) {
            // Change name
            await changeProfileName(name)
        }

        if (email !== userCredentials?.email) {
            // Change email
            await changeProfileEmail(email)
        }
    }

    return userCredentials ? (
        <div className="profile">
            <header className="profileHeader">
                <p className="pageHeader">حساب کاربری</p>
                <button onClick={signOut} className="logOut">
                    خروج
                </button>
            </header>

            <main>
                <div className="profileDetailsHeader">
                    <p className="profileDetailsText">اطلاعات کاربری</p>
                    <p
                        className="changePersonalDetails"
                        onClick={() => {
                            setChangeUserDetailsStatus(!changeUserDetailsStatus)
                        }}
                    >
                        {
                            // prettier-ignore
                            changeUserDetailsStatus
                                 ? 'عدم تغییر'
                                 : 'تغییر'
                        }
                    </p>
                </div>

                <div className="profileCard">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            type="text"
                            id="name"
                            className={
                                !changeUserDetailsStatus
                                    ? 'profileName'
                                    : 'profileNameActive'
                            }
                            disabled={!changeUserDetailsStatus}
                            {...register('name', {
                                required: true,
                            })}
                            defaultValue={userCredentials.displayName!}
                        />

                        {errors.name && (
                            <span className="field-error">
                                نام نمیتواند خالی باشد.
                            </span>
                        )}
                        <input
                            type="text"
                            id="email"
                            className={
                                !changeUserDetailsStatus
                                    ? 'profileEmail'
                                    : 'profileEmailActive'
                            }
                            disabled={!changeUserDetailsStatus}
                            {...register('email', {
                                required: true,
                                pattern:
                                    /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
                            })}
                            defaultValue={userCredentials.email!}
                        />
                        {errors.email && (
                            <span className="field-error">
                                لطفا یک ایمیل معتبر وارد کنید.
                            </span>
                        )}
                        <button className="btn btn--primary">ثبت</button>
                    </form>
                </div>
            </main>
        </div>
    ) : (
        <Loader loadingState={true} />
    )
}

export default ProfilePage
