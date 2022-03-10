export type TLisitngs = {
    id?: string
    name: string
    type: string
    userRef: string
    location: string
    timestamp: string
    bedrooms: number
    bathrooms: number
    regularPrice: number
    discountedPrice: number
    parking: boolean
    furnished: boolean
    offer: boolean
    imageUrls: string[]
    geolocation: {
        lat: string
        lng: string
    }
}
