const express = require("express");
const querys = require("../helpers/querys");
const ApiError = require("../error/apiError");

// Trazendo o Dados do client que esta vinculado com o user por chave estrangeira
exports.getAllKeys = async (req, res, next) => {
  /*
        #swagger.tags = ['Private / Client']

   */

  try {
    querys
      .selectKey("users", req.params.id)
      .then((result) => {
        // convertendo a data para padrao brazileiro
        const date = result.birthday
          .toISOString()
          .split("T")[0]
          .split("-")
          .reverse()
          .join("/");
        const data = {
          ...result,
          birthday: date,
        };

        res.status(200).json(data);
      })
      .catch((err) => {
        next(ApiError.internal(err.message));
      });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};

exports.updateClient = async (req, res, next) => {
  /*
            #swagger.tags = ['Private / Client']

     */

  const { birthday, emergencynumber, helth_insurance, gender, name, lastname } =
    req.body;

  const id = req.params.id;

  try {
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};