const Joi = require("joi");

const Contact = require("../models/contact");

const { HttpErrors } = require("../helpers");

const addSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required":`missing required "name" field`,  
    "string.empty" : `"name" cannot be an empty field`,
  }),
  phone: Joi.string().required().messages({
    "any.required":`missing required "phone" field`,  
    "string.empty" : `"phone" cannot be an empty field`,
  }),
  email: Joi.string().required().messages({
    "any.required":`missing required "email" field`,  
    "string.empty" : `"email" cannot be an empty field`,
  }),
  favorite: Joi.boolean().messages({
    "any.required": `missing required "favorite" field`,
    "string.empty": `"favorite" cannot be an empty field,`,
  }),
});

  const favoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
  })

  const getAllReq = async (req, res, next) => {
    try {
      const { _id: owner } = req.user;
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;
      const all = await Contact.find({ owner }, "-createdAt -updatedAT", {
        skip,
        limit,
      }).populate("owner", "subscription email");
      res.json(all);
    } catch (error) {
      next(error);
    }
  };

  const getByIdReq = async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const byId = await Contact.findById(contactId);
  
      if (!byId) {
        throw HttpErrors(404, "Not found");
      }
      res.json(byId);
    } catch (error) {
      next(error);
    }
  }

const postReq = async (req, res, next) => {
    try {
      const { error } = addSchema.validate(req.body);
      if (error) {
        throw HttpErrors(400, error.message);
      }
      const { _id: owner } = req.user;
      const add = await Contact.create({ ...req.body, owner });
      res.status(201).json(add);
    } catch (error) {
      next(error);
    }
  }

const deleteReq = async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const remove = await Contact.findByIdAndRemove(contactId);
  
      if (!remove) {
        throw HttpErrors(404, "Not found");
      }
  
      res.json({
        message: "Delete success",
      });
    } catch (error) {
      next(error);
    }
  }

  const putReq = async (req, res, next) => {
    try {
      const { error } = addSchema.validate(req.body);
      
      if (!req.body || Object.keys(req.body).length === 0) {
        const error = new Error("Missing fields");
        error.status = 400;
        throw error;
      }
      
      
      if (error) {
        throw HttpErrors(400, error.message);
      }
      const { contactId } = req.params;
      const result = await Contact.findByIdAndUpdate(contactId, req.body);
      if (!result) {
        throw HttpErrors(404, "Not found");
      }
      res.json(result);
    } catch (error) {
      next(error);
    }
  }


  const patchReq = async (req, res, next) => {
    try {
      const { error } = favoriteSchema.validate(req.body);
      if (error) {
        throw HttpErrors(400, "missing field favorite");
      }
      const { contactId } = req.params;
      const result = await Contact.findByIdAndUpdate(contactId, req.body, {
        new: true,
      });
      if (!result) {
        throw HttpErrors(404, "Not found");
      }
      res.json(result);
    } catch (error) {
      next(error);
    }
};
  
  module.exports = {
    getAllReq,
    getByIdReq,
    postReq,
    deleteReq,
    putReq,
    patchReq,
  }