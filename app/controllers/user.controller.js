const db = require("../models");
const { runInThisContext } = require("vm");
const { sequelize } = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const seq = db.sequelize;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.create = (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  bcrypt.hash(req.body.password, 10)
    .then(hash =>{
      const user = {
        name: req.body.name,
        email: req.body.email,
        password: hash,
      };
      User.create(user)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the user."
        });
      });
    })
    .catch(error => res.status(500).json({error}));
};

exports.findAll = (req, res) => {
const name = req.query.name;
var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
User.findAll({ where: condition })
    .then(data => {
      res.send(data);
      console.log(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
        err.message || "Some error occurred while retrieving users."
      });
    });
};

exports.findOne = (req, res) => {
  const email = req.params.email;
  User.findOne({where : email == email})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with email=" + email
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  User.update(req.body, {
      where: { id: id }
  })
    .then(num => {
      if (num == 1) {
          res.send({
          message: "User was updated successfully."
          });
      } else {
          res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
          });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
          res.send({
          message: "User was deleted successfully!"
          });
      } else {
          res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
          });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
User.destroy({
    where: {},
    truncate: false
})
    .then(nums => {
    res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch(err => {
    res.status(500).send({
        message:
        err.message || "Some error occurred while removing all users."
    });
    });
};

exports.login = (req, res) => {
  User.findOne({where : {email : req.body.email}})
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
      .then(valid => {
        if (!valid) {
          return res.status(401).json({ error: 'Mot de passe incorrect !' });
        }
        console.log("Authentification valided");
        res.status(200).json({
          user,
          userId: user.id,
          token: jwt.sign(
            { userId: user.id },
            'RANDOM_TOKEN_SECRET',
            { expiresIn: '24h' }
          )
        });
      })
      .catch(error => res.status(500).json({ error }));  
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with email=" + user.email
      });
    })
};