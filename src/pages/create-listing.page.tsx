import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { User } from 'firebase/auth'

import { auth, uploadImage, setDocOnFirestore } from '../firebase/firebase'
import Loader from '../components/loader.component'
import { toast } from 'react-toastify'
import { serverTimestamp } from 'firebase/firestore'

const CreateListingPage = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [, setUserCredentials] = useState<User | null>(null)

    const [formData, setFormData] = useState<{
        type: string
        name: string
        address: string
        bedrooms: number
        bathrooms: number
        regularPrice: number
        discountedPrice?: number
        latitude: number
        longitude: number
        offer: boolean
        parking: boolean
        furnished: boolean
        images?: any[]
    }>({
        type: 'rent',
        name: '',
        bedrooms: 0,
        bathrooms: 0,
        parking: false,
        furnished: false,
        address: '',
        offer: false,
        regularPrice: 471983,
        discountedPrice: 0,
        images: [],
        latitude: 0,
        longitude: 0,
    })

    const {
        type,
        name,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        address,
        offer,
        regularPrice,
        discountedPrice,
        images,
        latitude,
        longitude,
    } = formData

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

    const onMutate = (e: any): void => {
        // Images
        if (e.target.files) {
            const images = e.target.files

            setFormData(prevState => ({
                ...prevState,
                images,
            }))
        }
        // Text/Boolean/Number
        let boolean: boolean | null = null

        if (e.target.value === 'true') boolean = true
        if (e.target.value === 'false') boolean = false

        if (!e.target.files)
            setFormData(prevState => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,
            }))
    }

    const onSubmit = async (e: any) => {
        e.preventDefault()

        setIsLoading(true)

        if (images!.length > 6) {
            toast.error('حداکثر ۶ عکس مجار می باشد.')
            setIsLoading(false)
            return
        }

        if (discountedPrice! >= regularPrice) {
            toast.error('قیمت تخفیف دار باید کمتر از قیمت معمولی باشد.')
            setIsLoading(false)
            return
        }

        const imageUrls = await Promise.all(
            [...images!].map(imageEl => uploadImage(imageEl))
        ).catch(() => {
            toast.error('خطایی رخ داده است. دوباره تلاش کنید.')
            return
        })

        const dataToSend = {
            ...formData,
            creatorID: auth.currentUser?.uid,
            imageUrls,
            timestamp: serverTimestamp(),
        }

        delete dataToSend.images
        !offer && delete dataToSend.discountedPrice

        const status = await setDocOnFirestore(dataToSend, 'listings')

        if (status) toast.error('خطایی رخ داده است. دوباره تلاش کنید.')

        setIsLoading(false)
        toast.success('آگهی با موفقیت ثبت شد.')
    }

    return (
        <>
            <div className="profile">
                <header>
                    <p className="pageHeader">ایحاد آگهی</p>
                </header>

                <main>
                    <form onSubmit={onSubmit}>
                        <label className="formLabel">نوع آکهی</label>
                        <div className="formButtons">
                            <button
                                type="button"
                                className={
                                    type === 'sale'
                                        ? 'formButtonActive'
                                        : 'formButton'
                                }
                                id="type"
                                value="sale"
                                onClick={onMutate}
                            >
                                فروش
                            </button>
                            <button
                                type="button"
                                className={
                                    type === 'rent'
                                        ? 'formButtonActive'
                                        : 'formButton'
                                }
                                id="type"
                                value="rent"
                                onClick={onMutate}
                            >
                                اجاره
                            </button>
                        </div>

                        <label className="formLabel">عنوان</label>
                        <input
                            className="formInputName"
                            type="text"
                            id="name"
                            value={name}
                            onChange={onMutate}
                            required
                        />

                        <div className="formRooms flex">
                            <div>
                                <label className="formLabel">اتاق خواب</label>
                                <input
                                    className="formInputSmall"
                                    type="number"
                                    id="bedrooms"
                                    value={bedrooms}
                                    onChange={onMutate}
                                    min="1"
                                    max="50"
                                    required
                                />
                            </div>
                            <div>
                                <label className="formLabel">دستشویی</label>
                                <input
                                    className="formInputSmall"
                                    type="number"
                                    id="bathrooms"
                                    value={bathrooms}
                                    onChange={onMutate}
                                    min="1"
                                    max="50"
                                    required
                                />
                            </div>
                        </div>

                        <label className="formLabel">پارکینگ</label>
                        <div className="formButtons">
                            <button
                                className={
                                    parking ? 'formButtonActive' : 'formButton'
                                }
                                type="button"
                                id="parking"
                                value="true"
                                onClick={onMutate}
                            >
                                دارای پارکینگ
                            </button>
                            <button
                                className={
                                    !parking && parking !== null
                                        ? 'formButtonActive'
                                        : 'formButton'
                                }
                                type="button"
                                id="parking"
                                value="false"
                                onClick={onMutate}
                            >
                                بدون پارکینگ
                            </button>
                        </div>

                        <label className="formLabel">مبله</label>
                        <div className="formButtons">
                            <button
                                className={
                                    furnished
                                        ? 'formButtonActive'
                                        : 'formButton'
                                }
                                type="button"
                                id="furnished"
                                value="true"
                                onClick={onMutate}
                            >
                                می باشد
                            </button>
                            <button
                                className={
                                    !furnished && furnished !== null
                                        ? 'formButtonActive'
                                        : 'formButton'
                                }
                                type="button"
                                id="furnished"
                                value="false"
                                onClick={onMutate}
                            >
                                نمی باشد
                            </button>
                        </div>

                        <label className="formLabel">آدرس</label>
                        <textarea
                            className="formInputAddress"
                            id="address"
                            value={address}
                            onChange={onMutate}
                            required
                        />

                        <div className="formLatLng flex flex-column">
                            <div>
                                <label className="formLabel">
                                    عرض جغرافیایی
                                </label>
                                <input
                                    className="formInputSmall"
                                    type="number"
                                    id="latitude"
                                    value={latitude}
                                    onChange={onMutate}
                                    required
                                />
                            </div>
                            <div>
                                <label className="formLabel">
                                    طول جغرافیایی
                                </label>
                                <input
                                    className="formInputSmall"
                                    type="number"
                                    id="longitude"
                                    value={longitude}
                                    onChange={onMutate}
                                    required
                                />
                            </div>
                        </div>

                        <label className="formLabel">اعمال تخفیف</label>
                        <div className="formButtons">
                            <button
                                className={
                                    offer ? 'formButtonActive' : 'formButton'
                                }
                                type="button"
                                id="offer"
                                value="true"
                                onClick={onMutate}
                            >
                                اعمال
                            </button>
                            <button
                                className={
                                    !offer && offer !== null
                                        ? 'formButtonActive'
                                        : 'formButton'
                                }
                                type="button"
                                id="offer"
                                value="false"
                                onClick={onMutate}
                            >
                                عدم اعمال
                            </button>
                        </div>

                        <label className="formLabel">قیمت</label>
                        <div className="formPriceDiv">
                            <input
                                className="formInputSmall"
                                type="number"
                                id="regularPrice"
                                value={regularPrice}
                                onChange={onMutate}
                                min="50"
                                required
                            />
                            {type === 'rent' && (
                                <p className="formPriceText">تومان / ماهانه</p>
                            )}
                            {type === 'sale' && (
                                <p className="formPriceText">تومان</p>
                            )}
                        </div>

                        {offer && (
                            <>
                                <label className="formLabel">
                                    قیمت دارای تخفیف
                                </label>
                                <input
                                    className="formInputSmall"
                                    type="number"
                                    id="discountedPrice"
                                    value={discountedPrice}
                                    onChange={onMutate}
                                    min="50"
                                    required={offer}
                                />
                                <p className="formPriceText">تومان</p>
                            </>
                        )}

                        <label className="formLabel">تصاویر</label>
                        <p className="imagesInfo">
                            اولین تصویر به عنوان کاور استفاده خواهد شد. (حداکثر
                            ۶ عکس با حجم کمتر از ۲ مگابایت مجاز می باشد.)
                        </p>
                        <input
                            className="formInputFile"
                            type="file"
                            id="images"
                            onChange={onMutate}
                            max="6"
                            accept="image/jpg, image/png, image/jpeg, image/webp"
                            multiple
                            required
                        />
                        <button
                            type="submit"
                            className="primaryButton createListingButton"
                        >
                            ایجاد آگهی
                        </button>
                    </form>
                </main>
            </div>
            <Loader loadingState={isLoading} />
        </>
    )
}

export default CreateListingPage
