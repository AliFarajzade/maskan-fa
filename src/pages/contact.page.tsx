import { useSearchParams, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { getDocument } from '../firebase/firebase'

import { TUser } from '../types/user.types'
import { toast } from 'react-toastify'
import Loader from '../components/loader.component'

type TInputs = {
    message: string
}

const ContactPage = () => {
    const [landlordData, setLandlordData] = useState<null | TUser | string>(
        null
    )
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [searchParams] = useSearchParams()

    const { register, watch } = useForm<TInputs>()

    const { landlordID } = useParams()

    const message = watch('message')

    useEffect(() => {
        ;(async () => {
            setIsLoading(true)
            const status = await getDocument('users', landlordID!)

            if (!status) {
                toast.error('صاحب خانه یافت نشد.')
                setIsLoading(false)

                return
            }

            if (status === 'unavailable') {
                setIsLoading(false)
                toast.error('خطا در دریافت اطلاعات.')
                return
            }

            setLandlordData(status)
            setIsLoading(false)
        })()
    }, [landlordID])

    return (
        <>
            <div className="pageContainer pb-3">
                <header>
                    <p className="pageHeader">ارتباط با صاحب خانه</p>
                </header>

                {landlordData !== null && typeof landlordData !== 'string' && (
                    <main>
                        <div className="contactLandlord">
                            <p className="landlordName">
                                ارسال ایمیل به{' '}
                                <span className="italic">
                                    {landlordData.displayName}
                                </span>
                            </p>
                        </div>

                        <form noValidate className="messageForm">
                            <div className="messageDiv">
                                <label
                                    htmlFor="message"
                                    className="messageLabel"
                                >
                                    پیام
                                </label>
                                <textarea
                                    id="message"
                                    className="textarea"
                                    {...register('message', { required: true })}
                                ></textarea>
                                {!message.trim() && (
                                    <span className="field-error">
                                        پیام نمی تواند خالی باشد.
                                    </span>
                                )}
                            </div>

                            <a
                                href={`mailto:${
                                    landlordData.email
                                }?Subject=${searchParams.get(
                                    'listingName'
                                )}&body=${message}`}
                            >
                                <button type="button" className="primaryButton">
                                    ارسال پیام
                                </button>
                            </a>
                        </form>
                    </main>
                )}
            </div>

            <Loader loadingState={isLoading} />
        </>
    )
}

export default ContactPage
