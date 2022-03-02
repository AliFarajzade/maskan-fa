import { useNavigate, useLocation } from 'react-router-dom'
import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg'
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg'
import { ReactComponent as PersonOutlineIcon } from '../assets/svg/personOutlineIcon.svg'

const Navbar: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const pathMatchRoute = (route: string): boolean | undefined => {
        if (route === location.pathname) return true
    }
    return (
        <footer className="navbar">
            <nav className="navbarNav">
                <ul className="navbarListItems">
                    <li
                        className="navbarListItem"
                        onClick={() => navigate('/')}
                    >
                        <ExploreIcon
                            fill={pathMatchRoute('/') ? '#00cc66' : '#8f8f8f'}
                            width="28px"
                            height="28px"
                        />
                        <p
                            className={
                                pathMatchRoute('/')
                                    ? 'navbarListItemNameActive'
                                    : 'navbarListItemName'
                            }
                        >
                            آگهی ها
                        </p>
                    </li>
                    <li
                        className="navbarListItem"
                        onClick={() => navigate('/offers')}
                    >
                        <OfferIcon
                            fill={
                                pathMatchRoute('/offers')
                                    ? '#00cc66'
                                    : '#8f8f8f'
                            }
                            width="28px"
                            height="28px"
                        />
                        <p
                            className={
                                pathMatchRoute('/offers')
                                    ? 'navbarListItemNameActive'
                                    : 'navbarListItemName'
                            }
                        >
                            پیشنهادات ویژه
                        </p>
                    </li>
                    <li
                        className="navbarListItem"
                        onClick={() => navigate('/profile')}
                    >
                        <PersonOutlineIcon
                            fill={
                                pathMatchRoute('/profile')
                                    ? '#00cc66'
                                    : '#8f8f8f'
                            }
                            width="28px"
                            height="28px"
                        />
                        <p
                            className={
                                pathMatchRoute('/profile')
                                    ? 'navbarListItemNameActive'
                                    : 'navbarListItemName'
                            }
                        >
                            پروفایل
                        </p>
                    </li>
                </ul>
            </nav>
        </footer>
    )
}

export default Navbar
