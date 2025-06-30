import mongoose from "mongoose";

const contactsSchema = new mongoose.Schema(
    {
        first_name: {type: String},
        last_name: {type: String},
        email: {type: String},
        subject: {type: String},
        message: {type: String},
        status: {type: Boolean, default: false},
        is_deleted: {type: Boolean, default: false},
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id.toString(); // _id → id
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

export const Contacts = mongoose.model("Contacts", contactsSchema);
