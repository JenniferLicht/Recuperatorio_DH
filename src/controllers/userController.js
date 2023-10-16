const db = require('../database/models');
const path = require("path");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");


module.exports = {
  signinForm: function (req, res) {
    res.render("users/signinForm");
  },
  loginForm: function (req, res) {
    return res.render("users/loginForm");
  },
  
  createUser: function (req, res) {
    return res.render("users/createUser");
  },
  loginProcess: async function (req, res) {
    try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("users/loginForm", { errors: errors.mapped() });
    }
    const usuario = await db.User.findOne({
      where: { email: req.body.email, bajaLogica: false }
    });
    if (!usuario){    
      return res.render("users/loginForm", {
        errors: { datosIncorrectos: { msg: "Usuario inexistente." } },
      });
     }
    

      if (await bcryptjs.compare(req.body.clave, usuario.clave)) {
        req.session.usuarioLogeado = usuario;

          res.cookie("recordarUsuario", usuario, {
            maxAge: 1000 * 60 * 60 * 72,
          });
          return res.redirect("/user/getUserProfil");
         
      } else {
        return res.render("users/loginForm", {errors: { datosIncorrectos: { msg: "Usuario y contraseña no coincide." } }, });
      }
    } catch (error) {
      console.log(error);
        return res.render("users/loginForm", {errors: { datosIncorrectos: { msg: "Ocurrio un Error" } }, });

    }
  },
  logout: function (req, res) {
    req.session.destroy();

    res.clearCookie("recordarUsuario");
    res.redirect("/");
  },

  signinProcess: async function (req, res) {
    const avatar =  req.file && req.file.filename?req.file.filename:"/defaultImage.png";
  
    try {
      const userExists = await db.User.findOne({
        where: { email: req.body.email, bajaLogica: false }
      });
  
      if (userExists) {
      return res.status(500).json({ mensaje: "Error Usuario existente." });

      }
  
      const t = await db.sequelize.transaction();
  
      const user = await db.User.create({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        clave: req.body.clave,
        esAdmin: req.body.esAdmin,
        bajaLogica: false,
        fechaRegistro: new Date(),

      }, { transaction: t });
  
      const userProfileImage = await db.UserProfileImage.create({
        ubicacion: avatar,
        bajaLogica: false,
        userID: user.userID
      }, { transaction: t });
      await t.commit();
      return res.status(200).json({ mensaje: "El usuario se Registro correctamente." });

    } catch (error) {

      return res.status(500).json({ mensaje: "Ocurrió un error al registrar el usuario." });
    }
  },
  allUserData : async function (req, res){
    let response={data:{}};
    const usuarioLogeado = req.cookies.recordarUsuario;

    db.User.findAll({
      include: [
        {
          model: db.UserProfileImage,
          as: 'ProfileImage',
          where: {
            bajaLogica: false
          }
        }
      ],
      where: {
        bajaLogica: false
      }
    })
    .then(users => {
      const formattedUsers = users.map(user => {
        return {
          userID: user.userID,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          imagen: {
            imageID: user.ProfileImage.imageID,
            ubicacion: user.ProfileImage.ubicacion
          }
        };
      }).filter(user => user.userID !== usuarioLogeado.userID);
      
      response = { data: formattedUsers };
      return  res.render('users/allUserData', response);
    })
    .catch(error => {
      console.error(error);
      return res.json(error);
    });
  },
  editActiveDataUser : async function (req, res) {
    const usuarioLogeado = req.cookies.recordarUsuario;
    const usuario = req.body;

    const t = await db.sequelize.transaction();
  
    try {
      const existUser = await db.User.findOne({
        where: { userID: usuario.userID, bajaLogica: false },
        transaction: t
      });
  
      if (!existUser) {
        await t.rollback();
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
  
      await db.User.update(
        {
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email
        },
        {
          where: {
            userID: usuario.userID,
            bajaLogica: false
          },
          transaction: t
        }
      );
      let nombreArchivo= "";
      if (req.file) {
        nombreArchivo =req.file.filename;
      } else {
        nombreArchivo = usuario.ubicacion;
      }
      
      if (nombreArchivo) {
        await db.UserProfileImage.update(
          { ubicacion: nombreArchivo },
          {
            where: {
              userID: usuario.userID,
              imageID: usuario.imageID,
              bajaLogica: false
            },
            transaction: t
          }
        );
      }
  
      await t.commit();
     
      return res.status(200).json({ mensaje: "Usuario actualizado exitosamente", usuarioLogeado });
    } catch (error) {
      console.error(error);
      await t.rollback();
      return res.status(404).json({ error: "Usuario no Actualizado" });
    }
  },
  changePassword: async function (req, res) {
    const usuarioLogeado = req.cookies.recordarUsuario;
    const userId = usuarioLogeado.userID;
    const contrasenaActual = req.body.contrasenaActual;
    const nuevaContrasena = req.body.nuevaContrasena;

    try {
      const usuario = await db.User.findOne({
        where: { userID: userId , bajaLogica: false }
      });

      if (!usuario) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }

      if (!bcryptjs.compareSync(contrasenaActual, usuario.clave)) {
        return res.status(400).json({ mensaje: "La contraseña actual es incorrecta" });
      }


      await db.User.update(
        {
          clave: nuevaContrasena
        },
        {
          where: {
            userID: userId
          }
        }
      );

      res.status(200).json({ mensaje: "Contraseña actualizada exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al cambiar la contraseña del usuario" });
    }
  },  
  disableUserAndProfileImage: async function (req, res) {
    const userId = req.params.userID; 
    const t = await db.sequelize.transaction();

    try {
      const usuario = await db.User.findOne({
        where: { userID: userId, bajaLogica: false },
        transaction: t
      });

      if (!usuario) {
        await t.rollback();
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      await db.User.update(
        {
          bajaLogica: true
        },
        {
          where: {
            userID: userId,
            bajaLogica: false
          },
          transaction: t
        }
      );

      await db.UserProfileImage.update(
        {
          bajaLogica: true
        },
        {
          where: {
            userID: userId,
            bajaLogica: false
          },
          transaction: t
        }
      );
      await t.commit();
      return   res.redirect("/user/allUserData");
    } catch (error) {
      console.error(error);
      await t.rollback();
      res.status(500).json({ error: "Error al dar de baja lógica al usuario y su imagen de perfil" });
    }
  },
  getEditUserDataById: async function (req, res) {
  try {
      const userID = req.params.userID;
      const usuario = await db.User.findOne({
        include: [
          {
            model: db.UserProfileImage,
            as: 'ProfileImage',
            where: {
              bajaLogica: false
            }
          }
        ],
        where: {
          userID: userID, 
          bajaLogica: false
        }
      })
      if (!usuario) {
          return res.status(404).json({ error: "Usuario no encontrado" });
      }
      const usuarioLogeado = req.cookies.recordarUsuario;
      return res.render("users/editUser", { usuario , usuarioLogeado}); 
      
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al obtener datos de usuario" });
  }
},
changePasswordForm: async function (req, res) {
  res.render('users/changePasswordForm',);
 }
,
getUserProfil: async function (req, res){
  try {
   const usuarioLogeado = req.cookies.recordarUsuario;
   const userID = usuarioLogeado.userID;
   const usuario = await db.User.findOne({
        include: [
          {
            model: db.UserProfileImage,
            as: 'ProfileImage',
            where: {
              bajaLogica: false
            }
          }
        ],
        where: {
          userID: userID, 
          bajaLogica: false
        }
      })

    if (usuario) {
      res.render('users/UserProfil', { usuario });
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }

}
};