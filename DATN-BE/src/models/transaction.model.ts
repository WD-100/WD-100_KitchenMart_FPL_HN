import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    orderInfo: String,
    amount: Number,
    bankCode: String,
    transactionNo: String,
    responseCode: String,
    payDate: String,
    cardType: String,
    bankTranNo: String,
    txnRef: String,
    transactionStatus: String,
  },
  {
    timestamps: true,
    toJSON: {
        transform(doc, ret: any) {
        ret.id = ret._id.toString(); // _id → id
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

export default mongoose.model("Transaction", transactionSchema);
