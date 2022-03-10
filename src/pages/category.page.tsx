import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import ListingItem from '../components/listing-item.component'
import Loader from '../components/loader.component'

import { getListingsDocuments } from '../firebase/firebase'
import { TLisitngs } from '../types/lisiting.types'

const CategoryPage = () => {
    const [listings, setListings] = useState<TLisitngs[] | [] | null>()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { categoryName } = useParams()

    console.log(categoryName)

    useEffect(() => {
        ;(async () => {
            setIsLoading(true)
            const requestStatus = await getListingsDocuments(categoryName!)

            console.log(requestStatus)

            switch (requestStatus) {
                case null:
                    toast.error('اطلاعات یافت نشد.')
                    break

                case []:
                    toast.error('اطلاعاتی وجود ندارد.')
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
    }, [categoryName])

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
                    </div>
                </>
            )}
            <Loader loadingState={isLoading} />
        </>
    )
}

export default CategoryPage
