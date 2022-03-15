import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { auth, getDocument } from '../firebase/firebase'
import { Link, useParams } from 'react-router-dom'
import Loader from '../components/loader.component'
import { TListing } from '../types/lisiting.types'
import { User } from 'firebase/auth'
import { toast } from 'react-toastify'

import shareIcon from '../assets/svg/shareIcon.svg'
import { numberDivider } from '../helpers/divider.helper'

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

const Listing = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [shareLinkStatus, setShareLinkStatus] = useState<boolean>(false)
    const [data, setData] = useState<TListing | null>(null)
    const [, setUserCredentials] = useState<null | User>(null)

    const { houseID } = useParams()

    useEffect(() => {
        ;(async () => {
            setIsLoading(true)
            const status = await getDocument('listings', houseID!)

            if (status === null) {
                toast.error('اطلاعات یافت نشد.')
                return
            }

            setData(status)
            setIsLoading(false)
        })()
    }, [houseID])

    useEffect(() => {
        const unSubscribeGoogleAuthObserver = auth.onAuthStateChanged(
            userAuth => {
                if (userAuth) {
                    setUserCredentials(userAuth)
                } else {
                    setUserCredentials(null)
                }
            }
        )

        return () => unSubscribeGoogleAuthObserver()
    }, [])

    return (
        <>
            {data && typeof data === 'object' && (
                <main>
                    <Swiper slidesPerView={1} pagination={{ clickable: true }}>
                        {data.imageUrls.map(url => (
                            <SwiperSlide key={uuid()}>
                                <div
                                    style={{
                                        background: `url(${url}) center no-repeat`,
                                        backgroundSize: 'cover',
                                    }}
                                    className="swiperSlideDiv"
                                ></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

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
                                ? numberDivider(data.discountedPrice) + ' تومان'
                                : numberDivider(data.regularPrice) + ' تومان'}
                        </p>
                        <p className="listingLocation">{data.address}</p>
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
                                {numberDivider(
                                    data.regularPrice - data.discountedPrice
                                )}{' '}
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

                        <div className="leafletContainer">
                            <MapContainer
                                center={[+data.latitude, +data.longitude]}
                                scrollWheelZoom={false}
                                zoom={15}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker
                                    position={[+data.latitude, +data.longitude]}
                                >
                                    <Popup>{data.address}</Popup>
                                </Marker>
                            </MapContainer>
                        </div>

                        {(auth.currentUser?.uid !== data.creatorID ||
                            auth.currentUser === null) && (
                            <Link
                                to={`/contact/${data.creatorID}?listingName=${data.name}&listingLocation=${data.address}`}
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
