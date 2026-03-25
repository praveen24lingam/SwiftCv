import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard', '/api/', '/r/'],
        },
        sitemap: 'https://swiftcv.in/sitemap.xml',
    }
}
