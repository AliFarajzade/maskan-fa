import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ListingItem from '../components/listing-item.component'
import Loader from '../components/loader.component'

import { getOffers } from '../firebase/firebase'
import { TListing } from '../types/lisiting.types'
import { DocumentData, QuerySnapshot } from 'firebase/firestore'

const OffersPage = () => {
    const [listings, setListings] = useState<TListing[] | [] | null>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [lastListingSnapshot, setLastListingSnapshot] =
        useState<null | QuerySnapshot<DocumentData>>(null)

    useEffect(() => {
        ;(async () => {
            setIsLoading(true)
            const { listings: requestStatus, lastDocSnapshot } =
                await getOffers()

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
            setLastListingSnapshot(lastDocSnapshot)
        })()
    }, [])

    const fetchMoreListings = async () => {
        setIsLoading(true)
        const { listings: requestStatus, lastDocSnapshot } = await getOffers(
            lastListingSnapshot
        )

        if (!lastListingSnapshot) {
            toast.success('آگهی ها به پایان رسید.')
            setLastListingSnapshot(null)
            setIsLoading(false)
            return
        }

        if (!requestStatus || typeof requestStatus === 'string') {
            setIsLoading(false)
            return
        }

        if (!lastDocSnapshot) setLastListingSnapshot(null)
        else setLastListingSnapshot(lastDocSnapshot)
        setListings(prevState => [...prevState!, ...requestStatus])
        setIsLoading(false)
    }

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
                        {lastListingSnapshot && (
                            <p className="loadMore" onClick={fetchMoreListings}>
                                آگهی بیشتر
                            </p>
                        )}
                    </div>
                </>
            )}
            <Loader loadingState={isLoading} />
        </>
    )
}

export default OffersPage
