export interface Category {
    id: string
    name: string
}

export type DiscountType =
    | "PERCENTAGE"
    | "FIXED_AMOUNT"

export interface Product {
    id: string
    category?: Category

    sku: string
    name: string
    description?: string

    price: number

    discountType?: DiscountType
    discountValue?: number

    imageUrl?: string

    attributes?: {
        preparationTime?: number
        spiceLevel?: number
        dietaryTags?: string[]
        cuisine?: {
            name: string
        }
    }
}