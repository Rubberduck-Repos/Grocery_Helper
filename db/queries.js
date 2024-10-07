const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()

async function addUser(firstName, lastName, email, hashedPassword, isTutor) {
    user = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        isTutor: isTutor
    }

    await prisma.users.create({ data: user })
}

async function findUserByEmail(email){
    const user = await prisma.users.findUnique({
        where: {
          email: email,
        },
      });
      return user;
}

async function findUserById(id){
    const user = await prisma.users.findUnique({
        where: {
          id: id,
        },
      });
      return user;
}

module.exports = {
    addUser,
    findUserByEmail,
    findUserById
};