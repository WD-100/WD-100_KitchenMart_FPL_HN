import { Contacts } from "../models/contacts.model";

export const create = async (req: any, res: any) => {
  try {
    await Contacts.create(req.body);
    res.status(201).json({
      message: "success",
      statusCode: 201,
    });
  } catch (error) {
  }
};
