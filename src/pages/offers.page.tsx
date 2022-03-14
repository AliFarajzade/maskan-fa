import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ListingItem from '../components/listing-item.component'
import Loader from '../components/loader.component'

import { getOffers } from '../firebase/firebase'
import { TListing } from '../types/lisiting.types'

const OffersPage = () => {
    const [listings, setListings] = useState<TListing[] | [] | null>()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        ;(async () => {
            setIsLoading(true)
            const requestStatus = await getOffers()

            console.log(requestStatus)

            switch (requestStatus) {
                case null:
                case []:
                    toast.error('اطلاعات یافت نشد.')
                    break

                case 'storage/unknown':
                    toast.error('خطایی رخ داده است. دوباره تلاش کنید.')
                    break

                default:
                    setListings(requestStatus)
                    break
            }
            setIsLoading(false)
        })()
    }, [])

    return (
        <>
            {listings?.length !== 0 && listings !== null && (
                <>
                    <div className="category">
                        <header>
                            <p className="pageHeader">پیشنهادات ویژه</p>
                        </header>

                        <main>
                            <ul className="categoryListings">
                                {listings?.map(houseObj => (
                                    <ListingItem
                                        key={houseObj.id}
                                        data={houseObj}
                                    />
                                ))}
                            </ul>
                        </main>
                    </div>
                </>
            )}
            <Loader loadingState={isLoading} />
        </>
    )
}

export default OffersPage
