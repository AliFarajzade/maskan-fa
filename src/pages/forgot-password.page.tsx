import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { toast } from 'react-toastify'

import { recoverPassword } from '../firebase/firebase'

import Loader from '../components/loader.component'

import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'

type TInputs = {
    email: string
}

const ForgotPasswordPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TInputs>()

    const onSubmit: SubmitHandler<TInputs> = async data => {
        setIsLoading(true)

        const { email } = data
        const status = await recoverPassword(email)

        if (!status) {
            toast.success('ایمیل ارسال شد.')
        } else {
            switch (status) {
                case 'auth/network-request-failed':
                    toast.error('خطا در ارسال اطلاعات. اینترنت خود را چک کنید.')
                    break
                case 'auth/too-many-requests':
                    toast.error('درخواست بیش از حد. کمی بعد تلاش کنید.')
                    break

                case 'auth/user-not-found':
                    toast.error('کاربر یافت نشد.')
                    break
            }
        }

        setIsLoading(false)
    }

    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">فراموشی رمز عبور</p>
                </header>

                <main>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <input
                            type="email"
                            className="emailInput"
                            placeholder="ایمیل"
                            id="email"
                            {...register('email', {
                                required: true,
                                pattern:
                                    /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
                            })}
                        />
                        {errors.email && (
                            <span className="field-error">
                                لطفا یک ایمیل معتبر وارد کنید.
                            </span>
                        )}
                        <Link className="forgotPasswordLink" to="/login">
                            ورود
                        </Link>

                        <div className="signInBar">
                            <div className="signInText">
                                ارسال ایمیل بازیابی رمز عبور
                            </div>
                            <button
                                disabled={isLoading}
                                className="signInButton"
                            >
                                <ArrowRightIcon
                                    fill="#ffffff"
                                    width="34px"
                                    height="34px"
                                />
                            </button>
                        </div>
                    </form>
                </main>
            </div>
            <Loader loadingState={isLoading} />
        </>
    )
}

export default ForgotPasswordPage
