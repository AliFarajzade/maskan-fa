import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { toast } from 'react-toastify'

import {
    signUpUserWithEmailandPassword,
    setDocOnFirestore,
} from '../firebase/firebase'

import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

import Loader from '../components/loader.component'

type TInputs = {
    name: string
    email: string
    password: string
}

const SignInPage = () => {
    const navigate = useNavigate()

    const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<TInputs>()

    const onSubmit: SubmitHandler<TInputs> = async data => {
        setIsLoading(true)
        // Get form data
        const { email, password, name } = data

        // Sign up user auth
        const signUpServerResponse = await signUpUserWithEmailandPassword(
            email,
            password,
            name
        )

        setIsLoading(false)
        // If sign up failed
        switch (signUpServerResponse) {
            case 'auth/network-request-failed':
                toast.error('خطا در ارسال اطلاعات. اینترنت خود را چک کنید.')
                break
            case 'auth/too-many-requests':
                toast.error('درخواست بیش از حد. کمی بعد تلاش کنید.')
                break

            default:
                navigate('/profile')

                await setDocOnFirestore(
                    signUpServerResponse,
                    'users',
                    signUpServerResponse!.uid
                )
                toast.success('ثبت نام با موفقیت انجام شد.')
                break
        }

        // Redirect to profile page if succesful
    }

    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">ثبت نام کنید!</p>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <input
                        type="text"
                        className="nameInput"
                        placeholder="نام"
                        id="name"
                        {...register('name', {
                            required: true,
                        })}
                    />
                    {errors.name && (
                        <span className="field-error">
                            نام نمیتواند خالی باشد.
                        </span>
                    )}

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
                                pattern:
                                    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/,
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
                            رمز عبور باید شامل حداقل ۶ کاراکتر، شامل حداقل ۱ حرف
                            بزرگ انگلیسی و یک عدد باشد.
                        </span>
                    )}

                    <Link to="/reset" className="forgotPasswordLink">
                        بازیابی رمز عبور
                    </Link>

                    {/* <div className="password-ruls">
                        <ul className="password-ruls__list">
                            <li className="password-ruls__item">
                                رمز عبور باید شامل حداقل ۶ کاراکتر باشد.
                            </li>
                            <li className="password-ruls__item">
                                رمز عبور باید حداقل شامل یک حرف بزرگ انگلیسی
                                باشد.
                            </li>
                            <li className="password-ruls__item">
                                رمز عبور باید حداقل شامل یک عدد باشد.
                            </li>
                        </ul>
                    </div> */}

                    <div className="signUpBar">
                        <p className="signUpText">ثبت نام</p>
                        <button type="submit" className="signUpButton">
                            <ArrowRightIcon
                                fill="#ffffff"
                                width="34px"
                                height="34px"
                            />
                        </button>
                    </div>
                </form>

                {/* Google Auth */}

                <Link to="/login" className="registerLink">
                    وارد حساب کاربری خود شوید.
                </Link>
            </div>
            <Loader loadingState={isLoading} />
        </>
    )
}

export default SignInPage
