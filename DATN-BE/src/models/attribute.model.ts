import mongoose, {Document, Schema} from "mongoose";

export interface IAttribute extends Document {
    name: string;
}

const attributeSchema = new Schema<IAttribute>(
    {
        name: {type: String, required: true, trim: true},
    },
    {timestamps: true}
);

export const Attribute = mongoose.model<IAttribute>("Attribute", attributeSchema);
