type LogLevel = "info" | "warn" | "error" | "debug"

interface LogEntry {
    level: LogLevel
    message: string
    timestamp: string
    data?: unknown
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === "development"

    private formatMessage(entry: LogEntry): string {
        const { level, message, timestamp, data } = entry
        const dataStr = data ? ` | ${JSON.stringify(data)}` : ""
        return `[${timestamp}] [${level.toUpperCase()}] ${message}${dataStr}`
    }

    private log(level: LogLevel, message: string, data?: unknown) {
        const entry: LogEntry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            data,
        }

        const formattedMessage = this.formatMessage(entry)

        switch (level) {
            case "error":
                console.error(formattedMessage)
                // In production, send to error tracking service
                // Example: Sentry.captureException(new Error(message))
                break
            case "warn":
                console.warn(formattedMessage)
                break
            case "info":
                if (this.isDevelopment) {
                    console.info(formattedMessage)
                }
                break
            case "debug":
                if (this.isDevelopment) {
                    console.debug(formattedMessage)
                }
                break
        }
    }

    info(message: string, data?: unknown) {
        this.log("info", message, data)
    }

    warn(message: string, data?: unknown) {
        this.log("warn", message, data)
    }

    error(message: string, data?: unknown) {
        this.log("error", message, data)
    }

    debug(message: string, data?: unknown) {
        this.log("debug", message, data)
    }
}

export const logger = new Logger()
