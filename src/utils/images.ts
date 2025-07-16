import { PlatformsEnum } from "@/interfaces/analysis.types"

export interface IAllowedDomain {
    hostname: string
    isNew: boolean
}

export const getImage = async({ imageURL, platform }: { imageURL: string, platform?: PlatformsEnum }) => {
    if (!imageURL) {
        return '/logo.png'
    } else {
        const res = await fetch(`/api/get-image?imageURL=${encodeURIComponent(imageURL)}`)
        const data = await res.json()
        return data.imageURL
    }
}

export const checkImageOptimization = async (imageURL: string) => {
    const res = await fetch(`/api/check-image?imageURL=${encodeURIComponent(imageURL)}`)
    const data = await res.json()
    return data.unoptimized ?? true
}