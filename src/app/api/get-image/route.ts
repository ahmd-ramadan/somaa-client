import fs from 'fs'
import path from 'path'
import { PlatformsEnum } from "@/interfaces/analysis.types"
import { hostname } from 'os'
import { NextResponse } from 'next/server'


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const imageURL = searchParams.get('imageURL')
    if (!imageURL) return NextResponse.json({ unoptimized: true })

    try {
        const response = await fetch(imageURL)
        if(response.ok) return NextResponse.json({ imageURL })
        else return NextResponse.json({ imageURL: '/logo.png'  })
    } catch {
        return NextResponse.json({ imageURL: '/logo.png'  })
    }
}