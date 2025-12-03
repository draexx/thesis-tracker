import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header Skeleton */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="space-y-2 flex-1">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Progress Card Skeleton */}
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </CardContent>
                    </Card>
                </div>

                {/* Chapters Card Skeleton */}
                <div className="md:col-span-1 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="border rounded-lg p-4 space-y-3">
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Milestones Card Skeleton */}
                <div className="md:col-span-2 lg:col-span-3">
                    <Card>
                        <CardHeader>
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="border rounded-lg p-4 space-y-2">
                                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
