const db = require("../config/dbconnection");
const querys = require("../helpers/querys");
const ApiError = require("../error/apiError");

const crypto = require("../config/bcrypt");

// Consultar todos os usuarios
exports.getAll = async (req, res, next) => {
  /*
      #swagger.tags = ['Private / User']
  */

  try {
    querys
      .select("users")
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        next(ApiError.internal(err.message));
      });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};

// Consultar Usuario por ID
exports.getById = async (req, res, next) => {
  /*
      #swagger.tags = ['Private / User']
  */

  try {
    querys.select("users", req.params.id).then((result) => {
      res.json(result);
    });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};

// Adicionar Usuario
exports.add = async (req, res, next) => {
  /*
      #swagger.tags = ['public']
      #swagger.parameters['obj'] = {
              in: 'body',
              description: 'Informações do usuario',
              required: true,
              type: 'object',
              schema: { 
              $username: "Pedro", 
              $email: "teste@teste.com",
              $password: "123456",
              $passwordConfirmation: "123456",
              $birthday: "1990-01-01",
              $emergencynumber: "11999999999",
              $helth_insurance: "Nao",
              $gender: "M",
              $name: "Pedro",
              $lastname: "Lucas"
              }
    }
  */

  try {
    const { username, email, password } = req.body;
    const hash = await crypto.getHash(password);
    const data = {
      username,
      email,
      password: hash,
    };

    // Verificar se o usuario ja existe
    querys
      .verifyEmail("users", email)
      .then((result) => {
        if (result.length > 0) {
          res.status(400).json({
            message: "Email ja cadastrado! ",
          });
        } else {
          querys.insert("users", data).then((result) => {
            const id = result[0].id;
            const {
              birthday,
              emergencynumber,
              helth_insurance,
              gender,
              name,
              lastname,
            } = req.body;

            const data = {
              user_id: id,
              birthday,
              emergencynumber,
              helth_insurance,
              gender,
              name,
              lastname,
            };

            querys.insert("users_informations", data).then((results) => {
              res.status(200).json({
                message: "Cliente cadastrado com sucesso! ",
                data: {
                  user: {
                    id: result[0].id,
                    username: result[0].username,
                    email: result[0].email,
                  },
                  user_informations: {
                    ...results[0],
                  },
                },
              });
            });
          });
        }
      })
      .catch((err) => {
        next(ApiError.internal(err.message));
      });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};

// Atualizar todos os dados do usuario por ID username, email
exports.updateAll = async (req, res, next) => {
  /*
      #swagger.tags = ['Private / User']
  */
  try {
    const { username, email } = req.body;

    const data = {
      username,
      email,
    };

    querys
      .updateAll("users", data, req.params.id)
      .then((result) => {
        res.status(200).json({
          message: "Usuario atualizado com sucesso! ",
        });
      })
      .catch((err) => {
        next(ApiError.internal(err.message));
      });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};

// Atualizar somente o password do usuario por ID
exports.updatePassword = async (req, res, next) => {
  /*
      #swagger.tags = ['Private / User']
  */

  try {
    const { password } = req.body;
    const hash = await crypto.getHash(password);

    const data = {
      password: hash,
    };

    querys
      .updatePassword("users", data, req.params.id)
      .then((result) => {
        res.status(200).json({
          message: "Senha atualizada com sucesso! ",
        });
      })
      .catch((err) => {
        next(ApiError.internal(err.message));
      });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};

// Deletar o usuario por ID
exports.delete = async (req, res, next) => {
  /*
      #swagger.tags = ['Private / User']
  */

  try {
    querys
      .delete("users", req.params.id)
      .then((result) => {
        res.status(200).json({
          message: "Usuario deletado com sucesso! ",
        });
      })
      .catch((err) => {
        next(ApiError.internal(err.message));
      });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};
