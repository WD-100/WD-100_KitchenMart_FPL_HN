import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        full_name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        role_id: {type: mongoose.Schema.Types.ObjectId, ref: "Role"},
        is_deleted: {type: Boolean, default: false},
        phone_number: {type: String},
        location: {type: String},
        address: {type: String},
        avatar: {type: String},
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret: any) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                delete ret.password;
                return ret;
            },
        },
    }
);

export const User = mongoose.model("User", userSchema);
