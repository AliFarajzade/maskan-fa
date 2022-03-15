import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import ListingItem from '../components/listing-item.component'
import Loader from '../components/loader.component'

import { getListingsDocuments } from '../firebase/firebase'
import { TListing } from '../types/lisiting.types'
import { DocumentData, QuerySnapshot } from '@firebase/firestore'

const CategoryPage = () => {
    const [listings, setListings] = useState<TListing[] | [] | null>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [lastListingSnapshot, setLastListingSnapshot] =
        useState<null | QuerySnapshot<DocumentData>>(null)
    const { categoryName } = useParams()

    useEffect(() => {
        ;(async () => {
            setIsLoading(true)
            const { listings: requestStatus, lastDocSnapshot } =
                await getListingsDocuments(categoryName!)

            switch (requestStatus) {
                case null:
                case []:
                    toast.error('اطلاعات یافت نشد.')
                    break

                case 'firestore/unknown':
                    toast.error('خطایی رخ داده است. دوباره تلاش کنید.')
                    break

                default:
                    setLastListingSnapshot(lastDocSnapshot)
                    setListings(requestStatus)
                    break
            }
            setIsLoading(false)
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryName])

    const fetchMoreListings = async () => {
        if (!lastListingSnapshot) {
            toast.success('آگهی ها به پایان رسید.')
            return
        }
        const { listings: requestStatus, lastDocSnapshot } =
            await getListingsDocuments(categoryName!, lastListingSnapshot)

        setIsLoading(true)
        switch (requestStatus) {
            case []:
                toast.error('اطلاعات یافت نشد.')
                break

            case null:
                toast.success('آگهی ها به پایان رسید.')
                break

            case 'firestore/unknown':
                toast.error('خطایی رخ داده است. دوباره تلاش کنید.')
                break

            default:
                if (!lastDocSnapshot) setLastListingSnapshot(null)
                else setLastListingSnapshot(lastDocSnapshot)
                setListings(prevState => [...prevState!, ...requestStatus])
                break
        }
        setIsLoading(false)
    }

    return (
        <>
            {listings?.length !== 0 && listings !== null && (
                <>
                    <div className="category">
                        <header>
                            <p className="pageHeader">
                                {categoryName === 'rent'
                                    ? 'برای اجاره'
                                    : 'برای خرید'}
                            </p>
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
                        <br />
                        <br />
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

export default CategoryPage
