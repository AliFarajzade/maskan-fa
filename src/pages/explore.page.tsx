import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getListingsForExploreSlider } from '../firebase/firebase'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { v4 as uuid } from 'uuid'
import { Swiper, SwiperSlide } from 'swiper/react'
import { numberDivider } from '../helpers/divider.helper'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'
import { TListing } from '../types/lisiting.types'
import Loader from '../components/loader.component'

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

const ExplorePage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [data, setData] = useState<null | TListing[]>(null)

    useEffect(() => {
        ;(async () => {
            setIsLoading(true)
            const response = await getListingsForExploreSlider()

            if (!response || typeof response === 'string')
                return setIsLoading(false)

            setData(response)
            setIsLoading(false)
        })()
    }, [])

    return (
        <>
            <div className="explore">
                <header>
                    <p className="pageHeader">آگهی ها</p>
                </header>

                <main>
                    {data && data.length > 0 && (
                        <Swiper
                            slidesPerView={1}
                            pagination={{ clickable: true }}
                        >
                            {data.map(listingObj => (
                                <SwiperSlide key={uuid()}>
                                    <div
                                        style={{
                                            background: `url(${listingObj.imageUrls[0]}) center no-repeat`,
                                            backgroundSize: 'cover',
                                        }}
                                        className="swiperSlideDiv"
                                    >
                                        <p className="swiperSlideText">
                                            {listingObj.name}
                                        </p>
                                        <p className="swiperSlidePrice">
                                            {numberDivider(
                                                listingObj.discountedPrice
                                            ) ??
                                                numberDivider(
                                                    listingObj.regularPrice
                                                )}{' '}
                                            {listingObj.type === 'sale' &&
                                                'تومان /'}
                                            {' ماهانه'}
                                        </p>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}

                    <p className="exploreCategoryHeading">دسته بندی</p>
                    <div className="exploreCategories">
                        <Link to="/category/rent">
                            <img
                                src={rentCategoryImage}
                                alt="rent"
                                className="exploreCategoryImg"
                            />
                            <p className="exploreCategoryName">برای اجاره</p>
                        </Link>
                        <Link to="/category/sale">
                            <img
                                src={sellCategoryImage}
                                alt="sell"
                                className="exploreCategoryImg"
                            />
                            <p className="exploreCategoryName">برای فروش</p>
                        </Link>
                    </div>
                </main>
            </div>
            <Loader loadingState={isLoading} />
        </>
    )
}

export default ExplorePage
