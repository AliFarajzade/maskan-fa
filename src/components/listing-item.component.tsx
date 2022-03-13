import { Link } from 'react-router-dom'
// import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg'
// import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg'
import bedIcon from '../assets/svg/bedIcon.svg'
import bathtubIcon from '../assets/svg/bathtubIcon.svg'

import { TLisitng } from '../types/lisiting.types'

type IProps = {
    data: TLisitng
}

const ListingItem: React.FC<IProps> = ({
    data: {
        name,
        address,
        offer,
        discountedPrice,
        regularPrice,
        bedrooms,
        bathrooms,
        id,
        type,
        imageUrls,
    },
}) => {
    return (
        <li className="categoryListing">
            <Link
                to={`/category/${type}/${id}`}
                className="categoryListingLink"
            >
                <img
                    src={imageUrls[0]}
                    alt={name}
                    className="categoryListingImg"
                />
                <div className="categoryListingDetails">
                    <p className="categoryListingLocation">{address}</p>
                    <p className="categoryListingName">{name}</p>

                    <p className="categoryListingPrice">
                        {offer
                            ? discountedPrice
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            : regularPrice
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        {' تومان'} {type === 'rent' && '/ ماهانه'}
                    </p>
                    <div className="categoryListingInfoDiv">
                        <img src={bedIcon} alt="bed" />
                        <p className="categoryListingInfoText">
                            {bedrooms ? `اتاق ${bedrooms}` : 'بدون اتاق'}
                        </p>
                        <img src={bathtubIcon} alt="bath" />
                        <p className="categoryListingInfoText">
                            {bathrooms
                                ? `دستشویی ${bathrooms}`
                                : 'بدون دستشویی'}
                        </p>
                    </div>
                </div>
            </Link>

            {/* {onDelete && (
                <DeleteIcon
                    className="removeIcon"
                    fill="rgb(231, 76,60)"
                    onClick={() => onDelete(id, name)}
                />
            )} */}
        </li>
    )
}

export default ListingItem
