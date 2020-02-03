const Joi = require("joi");

exports.validateInputPart = function(part) {
  const schema = Joi.object({
    id: Joi.number()
      .integer()
      .min(1)
      .required(),
    name: Joi.string()
      .min(1)
      .required(),
    clientID: Joi.string()
      .min(1)
      .required()
  });
  let { error, value } = schema.validate(part);
  return error;
};
