import { Tesis } from "@prisma/client"

interface DashboardHeaderProps {
    user: {
        nombre: string
        avatar?: string | null
    }
    tesis: Pick<Tesis, "titulo"> | null
}

export function DashboardHeader({ user, tesis }: DashboardHeaderProps) {
    const initials = user.nombre
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.nombre}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        initials
                    )}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {user.nombre}
                    </h1>
                    {tesis ? (
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                            {tesis.titulo}
                        </p>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 mt-1 italic">
                            Sin tesis asignada
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
