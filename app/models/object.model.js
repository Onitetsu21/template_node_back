module.exports = (sequelize, Sequelize) => {
    const Object = sequelize.define("object", {
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        type: Sequelize.STRING
      },
      admin: {
        type: Sequelize.BOOLEAN,
        default: false
      }    
    }); 
    return Object;  
};
