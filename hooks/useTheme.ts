import { useTheme as useThemeContext } from "@/lib/context/ThemeContext"

export const useTheme = () => {
    return useThemeContext()
}
