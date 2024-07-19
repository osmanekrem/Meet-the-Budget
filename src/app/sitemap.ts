import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    return [
        {
            url: "https://meet-the-budget.vercel.app/",
            lastModified: new Date()
        },
        {
            url: "https://meet-the-budget.vercel.app/save",
            lastModified: new Date()
        },
        {
            url: "https://meet-the-budget.vercel.app/save/incomes",
            lastModified: new Date()
        },
        {
            url: "https://meet-the-budget.vercel.app/save/expenses",
            lastModified: new Date()
        },
        {
            url: "https://meet-the-budget.vercel.app/save/transfers",
            lastModified: new Date()
        },
        {
            url: "https://meet-the-budget.vercel.app/save/vaults",
            lastModified: new Date()
        },
    ]
}