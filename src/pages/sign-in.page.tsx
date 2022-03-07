import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { toast } from 'react-toastify'

import { signInUserWithEmailandPassword } from '../firebase/firebase'

import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import Loader from '../components/loader.component'

type TInputs = {
    email: string
    password: string
}

const SignInPage = () => {
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false)
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<TInputs>()

    const onSubmit: SubmitHandler<TInputs> = async data => {
        setIsLoading(true)
        let { email, password } = data

        email = email.toLocaleLowerCase()

        const requestStatus = await signInUserWithEmailandPassword(
            email,
            password
        )
        switch (requestStatus) {
            case 'auth/user-not-found':
                toast.error('کاربر یافت نشد.')
                break

            case 'auth/wrong-password':
                toast.error('ایمیل یا رمز عبور اشتباه است.')
                break
            case 'auth/network-request-failed':
                toast.error('خطا در ارسال اطلاعات. اینترنت خود را چک کنید.')
                break
            case 'auth/too-many-requests':
                toast.error('درخواست بیش از حد. کمی بعد تلاش کنید.')
                break

            default:
                toast.success('ورود با موفقیت انجام شد.')
                navigate('/profile')
        }
        setIsLoading(false)
    }

    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">خوش آمدید!</p>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <input
                        type="email"
                        className="emailInput"
                        placeholder="ایمیل"
                        id="email"
                        {...register('email', {
                            required: true,
                            pattern: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
                        })}
                    />
                    {errors.email && (
                        <span className="field-error">
                            لطفا یک ایمیل معتبر وارد کنید.
                        </span>
                    )}
                    <div className="passwordInputDiv">
                        <input
                            type={passwordVisibility ? 'text' : 'password'}
                            className="passwordInput"
                            placeholder="رمز عبور"
                            id="password"
                            defaultValue={
                                passwordVisibility ? watch('password') : ''
                            }
                            {...register('password', {
                                required: true,
                            })}
                        />

                        <img
                            onClick={() =>
                                setPasswordVisibility(!passwordVisibility)
                            }
                            src={visibilityIcon}
                            alt="show password"
                            className="showPassword"
                        />
                    </div>
                    {errors.password && (
                        <span className="field-error">
                            رمز عبور نمی تواند خالی باشد.
                        </span>
                    )}

                    <Link to="/reset" className="forgotPasswordLink">
                        بازیابی رمز عبور
                    </Link>

                    <div className="signInBar">
                        <p className="signInText">ورود</p>
                        <button type="submit" className="signInButton">
                            <ArrowRightIcon
                                fill="#ffffff"
                                width="34px"
                                height="34px"
                            />
                        </button>
                    </div>
                </form>

                {/* Google Auth */}

                <Link to="/register" className="registerLink">
                    ثبت نام
                </Link>
            </div>
            <Loader loadingState={isLoading} />
        </>
    )
}

export default SignInPage
