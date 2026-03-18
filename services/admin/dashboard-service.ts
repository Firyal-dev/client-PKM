'use server'

import api from '@/services/api'
import { authHeaders } from '@/services/server-helpers'

export interface DashboardStats {
    visitors: {
        total: number
        today: number
        thisMonth: number
        thisYear: number
    }
    consultations: number
    reviews: number
    agendas: number
    galleries: number
    albums: number
    videos: number
    menus: number
    dynamicPages: number
    staticPages: number
}

// Helper untuk extract total dari berbagai format response API
function extractTotal(data: any): number {
    if (!data) return 0
    // Cek berbagai kemungkinan field total
    return data.total || data.totalDocs || data.total_items || 0
}

// Helper untuk count total menus termasuk children
function countTotalMenus(data: any): number {
    if (!data?.data && !Array.isArray(data)) return 0
    
    const menus = Array.isArray(data) ? data : (data.data || [])
    let total = menus.length
    
    // Count child menus
    menus.forEach((menu: any) => {
        if (menu.children && Array.isArray(menu.children)) {
            total += menu.children.length
        }
    })
    
    return total
}

export async function getDashboardStats(): Promise<DashboardStats> {
    try {
        const headers = await authHeaders()

        // Fetch visitor stats
        const visitorPromises = Promise.all([
            api.get<number>('/v1/visitor/count', { headers }),
            api.get<number>('/v1/visitor/count-day', { headers }),
            api.get<number>('/v1/visitor/count-month', { headers }),
            api.get<number>('/v1/visitor/count-year', { headers }),
        ])

        // Fetch consultation counts
        const consultationPromise = api.get<any>('/v1/admin/consultation?page=1&limit=1', { headers })

        // Fetch review counts
        const reviewPromise = api.get<any>('/v1/admin/reviews?page=1&limit=1', { headers })

        // Fetch agenda counts
        const agendaPromise = api.get<any>('/v1/admin/agenda?page=1&limit=1', { headers })

        // Fetch gallery counts
        const galleryPromise = api.get<any>('/v1/admin/gallery?page=1&limit=1', { headers })

        // Fetch album counts
        const albumPromise = api.get<any>('/v1/admin/album?page=1&limit=1', { headers })

        // Fetch video counts
        const videoPromise = api.get<any>('/v1/admin/video?page=1&limit=1', { headers })

        // Fetch menu counts (use large limit to get all root menus with their children)
        const menuPromise = api.get<any>('/v1/admin/menus?page=1&limit=1000', { headers })

        // Fetch dynamic pages counts
        const dynamicPagePromise = api.get<any>('/v1/admin/pages?page=1&limit=1', { headers })

        // Fetch static pages counts
        const staticPagePromise = api.get<any>('/v1/admin/static-pages?page=1&limit=1', { headers })

        const [
            visitorStats,
            consultationRes,
            reviewRes,
            agendaRes,
            galleryRes,
            albumRes,
            videoRes,
            menuRes,
            dynamicPageRes,
            staticPageRes,
        ] = await Promise.all([
            visitorPromises,
            consultationPromise,
            reviewPromise,
            agendaPromise,
            galleryPromise,
            albumPromise,
            videoPromise,
            menuPromise,
            dynamicPagePromise,
            staticPagePromise,
        ])

        return {
            visitors: {
                total: visitorStats[0].data || 0,
                today: visitorStats[1].data || 0,
                thisMonth: visitorStats[2].data || 0,
                thisYear: visitorStats[3].data || 0,
            },
            consultations: extractTotal(consultationRes.data),
            reviews: extractTotal(reviewRes.data),
            agendas: extractTotal(agendaRes.data),
            galleries: extractTotal(galleryRes.data),
            albums: extractTotal(albumRes.data),
            videos: extractTotal(videoRes.data),
            menus: countTotalMenus(menuRes.data),
            dynamicPages: extractTotal(dynamicPageRes.data),
            staticPages: extractTotal(staticPageRes.data),
        }
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        // Return empty stats on error
        return {
            visitors: { total: 0, today: 0, thisMonth: 0, thisYear: 0 },
            consultations: 0,
            reviews: 0,
            agendas: 0,
            galleries: 0,
            albums: 0,
            videos: 0,
            menus: 0,
            dynamicPages: 0,
            staticPages: 0,
        }
    }
}
