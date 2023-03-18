import log from "../utils/logger";

type ex_type = Error | string

const exit = (code: number) => process.exit(code)

export default () =>{
    process.on("uncaughtException",(ex: ex_type)=>{
        console.log(ex)
    log("error", ex)
    exit(1)
})

process.on("unhandledRejection", (ex: ex_type)=>{
    console.log(ex)
    log("error", ex)
    exit(1)
})
}


