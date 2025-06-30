import { Contacts } from "../../models/contacts.model";

export const list = async (req: any, res: any) => {
  try {
    const contact = await Contacts.find({ is_deleted: false });
    res.status(200).json({
      message: "success",
      statusCode: 200,
      data: contact,
    });
  } catch (error) {
    console.log(error);
  }
};

export const detail = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const contact = await Contacts.findById({ _id: id, is_deleted: false });

    if (!contact) {
      return res.status(404).json({
        message: "Contacts not found",
        statusCode: 404,
      });
    }

    return res.status(200).json({
      message: "success",
      statusCode: 200,
      data: contact,
    });
  } catch (error) {
    console.error("Error in contact detail:", error);
    return res.status(500).json({
      message: "Internal server error",
      statusCode: 500,
    });
  }
};

export const update = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const contact = await Contacts.findById({ _id: id, is_deleted: false });

    if (!contact) {
      return res.status(404).json({
        message: "Contacts not found",
        statusCode: 404,
      });
    }

    contact.status = req.body.status;
    contact.save();

    return res.status(200).json({
      message: "update contact success",
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      statusCode: 500,
    });
  }
};

export const destroy = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const contact = await Contacts.findById({ _id: id, is_deleted: false });

    if (!contact) {
      return res.status(404).json({
        message: "Contacts not found",
        statusCode: 404,
      });
    }

    contact.is_deleted = true;
    contact.save();

    return res.status(200).json({
      message: "delete contact success",
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      statusCode: 500,
    });
  }
};
