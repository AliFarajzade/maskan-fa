import { useState, useEffect } from 'react'
import { auth, getDocument } from '../firebase/firebase'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from '../components/loader.component'
import { TLisitng } from '../types/lisiting.types'
import { User } from 'firebase/auth'
import { toast } from 'react-toastify'

import shareIcon from '../assets/svg/shareIcon.svg'

const Listing = () => {
    console.log(auth.currentUser)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [shareLinkStatus, setShareLinkStatus] = useState<boolean>(false)
    const [data, setData] = useState<TLisitng | null>(null)
    const [userCredentials, setUserCredentials] = useState<null | User>(null)

    const { houseID } = useParams()

    useEffect(() => {
        ;(async () => {
            setIsLoading(true)
            const status = await getDocument('listings', houseID!)

            console.log(status)
            if (status === null) {
                toast.error('اطلاعات یافت نشد.')
                return
            }

            setData(status)
            setIsLoading(false)
        })()
    }, [])

    useEffect(() => {
        const unSubscribeGoogleAuthObserver = auth.onAuthStateChanged(
            userAuth => {
                if (userAuth) {
                    setUserCredentials(userAuth)
                } else {
                    setUserCredentials(null)
                }
                console.log(userAuth)
            }
        )

        return () => unSubscribeGoogleAuthObserver()
    }, [])

    return (
        <>
            {data && (
                <main>
                    {/* SLIDER */}

                    <div
                        className="shareIconDiv"
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href)
                            setShareLinkStatus(true)
                            setTimeout(() => {
                                setShareLinkStatus(false)
                            }, 2000)
                        }}
                    >
                        <img src={shareIcon} alt="" />
                    </div>

                    {shareLinkStatus && (
                        <p className="linkCopied">لینک کپی شد!</p>
                    )}

                    <div className="listingDetails">
                        <p className="listingName">
                            {data.name} -
                            {data.offer
                                ? data.discountedPrice
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
                                  ' تومان'
                                : data.regularPrice
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
                                  ' تومان'}
                        </p>
                        <p className="listingLocation">{data.location}</p>
                        <p className="listingType">
                            برای
                            {data.type ===
                            // prettier-ignore
                            'rent'
                                ? ' اجاره'
                                : ' فروش'}
                        </p>
                        {data.offer && (
                            <p className="discountPrice">
                                {(data.regularPrice - data.discountedPrice)
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                                تومان تخفیف
                            </p>
                        )}

                        <ul className="listingDetailsList">
                            <li>
                                {data.bedrooms > 0
                                    ? `${data.bedrooms} اتاق`
                                    : 'بدون اتاق'}
                            </li>
                            <li>
                                {data.bathrooms > 0
                                    ? `${data.bathrooms} دستشویی`
                                    : 'بدون دستشویی'}
                            </li>
                            <li>{data.parking && 'دارای پارکینگ'}</li>
                            <li>{data.furnished && 'مبله می باشد'}</li>
                        </ul>

                        <p className="listingLocationTitle">موقعیت</p>

                        {/* MAP */}

                        {(auth.currentUser?.uid !== data.creatorID ||
                            auth.currentUser === null) && (
                            <Link
                                to={`/contact/${data.creatorID}?listingName=${data.name}&listingLocation=${data.location}`}
                                className="primaryButton"
                            >
                                ارتباط با صاحب
                            </Link>
                        )}
                    </div>
                </main>
            )}

            <Loader loadingState={isLoading} />
        </>
    )
}

export default Listing
