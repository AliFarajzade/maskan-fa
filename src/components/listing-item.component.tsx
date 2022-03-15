import { Link } from 'react-router-dom'
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg'
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg'
import bedIcon from '../assets/svg/bedIcon.svg'
import bathtubIcon from '../assets/svg/bathtubIcon.svg'

import { TListing } from '../types/lisiting.types'
import { numberDivider } from '../helpers/divider.helper'

type IProps = {
    data: TListing
    onDelete?: (listingID: string) => void
    onEdit?: (listingID: string) => void
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
    onDelete,
    onEdit,
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
                            ? numberDivider(discountedPrice)
                            : numberDivider(regularPrice)}
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

            {onDelete && (
                <DeleteIcon
                    className="removeIcon"
                    fill="rgb(231, 76,60)"
                    onClick={() => onDelete(id!)}
                />
            )}

            {onEdit && (
                <EditIcon
                    className="editIcon"
                    fill="#333"
                    onClick={() => onEdit(id!)}
                />
            )}
        </li>
    )
}

export default ListingItem
