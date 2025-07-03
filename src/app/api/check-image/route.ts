import fs from 'fs'
import path from 'path'
import { PlatformsEnum } from "@/interfaces/analysis.types"
import { hostname } from 'os'
import { NextResponse } from 'next/server'

export interface IAllowedDomain {
    hostname: string
    isNew: boolean
}

const filePath = path.resolve(process.cwd(), 'src/json/allowed_images_domains.json')

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const imageURL = searchParams.get('imageURL')
    if (!imageURL) return NextResponse.json({ unoptimized: true })

    let hostname: string
    try {
        const url = new URL(imageURL)
        hostname = url.hostname
    } catch {
        return NextResponse.json({ unoptimized: true })
    }

    let allowedDomains: IAllowedDomain[] = []
    try {
        allowedDomains = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    } catch {
        return NextResponse.json({ unoptimized: true })
    }

    const allowedPatterns = [
        /cdninstagram\.com$/,
        // Add more patterns if needed
    ]

    const isAllowed =
        allowedDomains.some(d => d.hostname === hostname) ||
        allowedPatterns.some(pattern => pattern.test(hostname))

    if (isAllowed) {
        return NextResponse.json({ unoptimized: false })
    }

    // Add new domain
    const newDomain: IAllowedDomain = { hostname, isNew: true }
    allowedDomains.push(newDomain)

    try {
        fs.writeFileSync(filePath, JSON.stringify(allowedDomains, null, 2), 'utf-8')
    } catch {
        return NextResponse.json({ unoptimized: true })
    }

    return NextResponse.json({ unoptimized: true })
}