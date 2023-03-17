import Winston from "winston";

type level_enum = "error" | "info" | "warning"

const logger = Winston.createLogger({
    transports:[new Winston.transports.File({filename: "logs"}), new Winston.transports.Console()]
})

const log = (level: level_enum, message: Error | string) => logger.log(level, message)

export default log