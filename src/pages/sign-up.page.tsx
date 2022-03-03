import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'

import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

type TInputs = {
    name: string
    email: string
    password: string
}

const SignInPage = () => {
    const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false)
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<TInputs>()

    const onSubmit: SubmitHandler<TInputs> = data => console.log(data)

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
                    {errors.email && (
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
        </>
    )
}

export default SignInPage
