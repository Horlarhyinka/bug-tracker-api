import { Schema, model, Document} from "mongoose";

export interface bug_int extends Document{ description: string, resolved: boolean}

const bugSchema = new Schema<bug_int>({
    description: {
        type: String,
        required: true
    },
    resolved:{
        type: Boolean,
        default: false
    }
},{ timestamps: true})

export default model<bug_int>("bug", bugSchema)