import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { User } from 'firebase/auth'
import { getUsersListings } from '../firebase/firebase'
import ListingItem from '../components/listing-item.component'
import { deleteDocument } from '../firebase/firebase'

import { TListing } from '../types/lisiting.types'

import rightArrow from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'

import { toast } from 'react-toastify'

import {
    auth,
    changeProfileEmail,
    changeProfileName,
} from '../firebase/firebase'

import Loader from '../components/loader.component'
import { DocumentData, QuerySnapshot } from 'firebase/firestore'

type TInputs = {
    name: string
    email: string
}

const ProfilePage = () => {
    const navigate = useNavigate()

    const [usersListings, setUsersListings] = useState<null | TListing[]>(null)
    const [userCredentials, setUserCredentials] = useState<User | null>(null)
    const [changeUserDetailsStatus, setChangeUserDetailsStatus] =
        useState<boolean>(false)

    const [lastListingSnapshot, setLastListingSnapshot] =
        useState<null | QuerySnapshot<DocumentData>>(null)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TInputs>()

    useEffect(() => {
        const unSubscribeGoogleAuthObserver = auth.onAuthStateChanged(
            userAuth => {
                setIsLoading(true)
                if (userAuth) {
                    setUserCredentials(userAuth)
                } else {
                    navigate('/login')
                    setUserCredentials(null)
                }
                setIsLoading(false)
            }
        )

        return () => unSubscribeGoogleAuthObserver()
    }, [navigate])

    useEffect(() => {
        userCredentials &&
            (async () => {
                setIsLoading(true)
                const { listings: response, lastDocSnapshot } =
                    await getUsersListings(userCredentials!.uid)

                if (!response || typeof response === 'string') {
                    setIsLoading(false)
                    return
                }

                setLastListingSnapshot(lastDocSnapshot)
                setUsersListings(response)
                setIsLoading(false)
            })()
    }, [userCredentials])

    const fetchMoreListings = async () => {
        if (!lastListingSnapshot) {
            toast.success('???????? ???? ???? ?????????? ????????.')
            return
        }
        setIsLoading(true)
        const { listings: response, lastDocSnapshot } = await getUsersListings(
            userCredentials!.uid,
            lastListingSnapshot
        )

        if (!response || typeof response === 'string') {
            setIsLoading(false)
            return
        }

        if (!lastDocSnapshot) setLastListingSnapshot(null)
        else setLastListingSnapshot(lastDocSnapshot)
        setUsersListings(prevState => [...prevState!, ...response])
        setIsLoading(false)
    }

    const signOut = () => {
        auth.signOut()
    }

    const handleError = (errorCode: string) => {
        switch (errorCode) {
            case 'auth/network-request-failed':
                toast.error('?????? ???? ?????????? ??????????????. ?????????????? ?????? ???? ???? ????????.')
                break
            case 'auth/too-many-requests':
                toast.error('?????????????? ?????? ???? ????. ?????? ?????? ???????? ????????.')
                break

            default:
                toast.error(
                    '???????? ???? ???????? ???????????? ?????? ???????? ?????? ?? ???????????? ???????? ????????.'
                )
                break
        }
    }

    const onDelete = async (listingID: string) => {
        if (window.confirm('?????? ???? ???????????? ?????? ???????? ???? ?????? ??????????')) {
            const response = await deleteDocument(listingID)
            response && toast.error('?????? ???????? ???? ?????? ???? ?????? ????.')
        }
    }

    const onEdit = async (listingID: string) => {
        navigate(`/edit-listing/${listingID}`)
    }

    const onSubmit: SubmitHandler<TInputs> = async data => {
        setIsLoading(true)
        let { email, name } = data

        if (name.trim() === '') {
            setIsLoading(false)
            return
        }

        email = email.toLocaleLowerCase()

        if (name !== userCredentials?.displayName) {
            // Change name
            const status = await changeProfileName(name)

            if (status) {
                handleError(status)
                setIsLoading(false)

                return
            }
        }

        if (email !== userCredentials?.email) {
            // Change email
            const status = await changeProfileEmail(email)

            if (status) {
                handleError(status)
                setIsLoading(false)

                return
            }
        }
        toast.success('?????????????? ???? ???????????? ?????????? ????.')
        setIsLoading(false)
    }

    return (
        <>
            {userCredentials && (
                <div className="profile">
                    <header className="profileHeader">
                        <p className="pageHeader">???????? ????????????</p>
                        <button onClick={signOut} className="logOut">
                            ????????
                        </button>
                    </header>

                    <main>
                        <div className="profileDetailsHeader">
                            <p className="profileDetailsText">?????????????? ????????????</p>
                            <p
                                className="changePersonalDetails"
                                onClick={() => {
                                    setChangeUserDetailsStatus(
                                        !changeUserDetailsStatus
                                    )
                                }}
                            >
                                {
                                    // prettier-ignore
                                    changeUserDetailsStatus
                                 ? '?????? ??????????'
                                 : '??????????'
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
                                    defaultValue={userCredentials.displayName!}
                                    {...register('name', {
                                        required: true,
                                    })}
                                />

                                <input
                                    type="text"
                                    id="email"
                                    className={
                                        !changeUserDetailsStatus
                                            ? 'profileEmail'
                                            : 'profileEmailActive'
                                    }
                                    disabled={!changeUserDetailsStatus}
                                    defaultValue={userCredentials.email!}
                                    {...register('email', {
                                        pattern:
                                            /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
                                    })}
                                />
                                {errors.email && (
                                    <span className="field-error">
                                        ???????? ???? ?????????? ?????????? ???????? ????????.
                                    </span>
                                )}
                                <button
                                    style={{
                                        cursor: changeUserDetailsStatus
                                            ? 'pointer'
                                            : 'default',
                                        backgroundColor: changeUserDetailsStatus
                                            ? '#00cc66'
                                            : '#999',
                                    }}
                                    disabled={!changeUserDetailsStatus}
                                    className="btn btn--primary"
                                >
                                    ??????
                                </button>
                            </form>
                        </div>

                        <Link to="/create-listing" className="createListing">
                            <img src={homeIcon} alt="home" />
                            <p>?????????? ???????? ???????? ???? ??????????</p>
                            <img
                                style={{ transform: 'rotate(180deg)' }}
                                src={rightArrow}
                                alt="arrow right"
                            />
                        </Link>
                        {usersListings && (
                            <>
                                <p className="listingText">???????? ?????? ??????</p>
                                <ul className="listingsList">
                                    {usersListings.map(listing => (
                                        <ListingItem
                                            key={listing.id}
                                            data={listing}
                                            onDelete={onDelete}
                                            onEdit={onEdit}
                                        />
                                    ))}
                                </ul>
                            </>
                        )}
                    </main>
                    {lastListingSnapshot && (
                        <p className="loadMore" onClick={fetchMoreListings}>
                            ???????? ??????????
                        </p>
                    )}
                </div>
            )}

            <Loader loadingState={isLoading} />
        </>
    )
}

export default ProfilePage
