import User from "../models/User.js";

// Importing db just in case need to refurbished/synchronize all models at once
import db from "./Database.js";
const sequelize = db.getSequelizeInstance();

const migrateMethod = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log(`All models were created/synchronized`);
  } catch (error) {
    console.log(error);
  }
};

migrateMethod();
