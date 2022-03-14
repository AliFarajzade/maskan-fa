export type TListing = {
    id?: string
    name: string
    type: string
    userRef: string
    address: string
    timestamp: string
    bedrooms: number
    bathrooms: number
    regularPrice: number
    discountedPrice: number
    parking: boolean
    furnished: boolean
    offer: boolean
    imageUrls: string[]

    latitude: string
    longitude: string

    creatorID?: string
}
