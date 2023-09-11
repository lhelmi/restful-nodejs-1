import { prismaClient } from "../src/application/database"
import bcrypt from "bcrypt";

const removeTestUser = async() => {
    await prismaClient.user.deleteMany({
        where : {
            username : 'test'
        }
    });
}

const createTestUser = async() => {
    await prismaClient.user.create({
        data : {
            username : "test",
            password : await bcrypt.hash("test", 10),
            name : "test",
            token : "test"
        }
    });
}

const getTestUser = async() => {
    return prismaClient.user.findUnique({
        where : {
            username : "test"
        }
    });
}

const removeAllTestContact = async() => {
    await prismaClient.contact.deleteMany({
        where : {
            username : "test"
        }
    });
}

const createTestContact = async() => {
    await prismaClient.contact.create({
        data : {
            first_name : "test",
            last_name : "test",
            email : "test@t.com",
            phone : "41242121",
            username : "test"
        }
    });
}

const getTestContact = async() => {
    return await prismaClient.contact.findFirst({
        where : {
            username : "test"
        }
    });
}

const createManyTestContact = async() => {
    for (let index = 0; index < 15; index++) {
        await prismaClient.contact.create({
            data : {
                first_name : `first test ${index}`,
                last_name : `last test ${index}`,
                email : `test${index}@test.com`,
                phone : `00${index}`,
                username : `test`
            }
        });
    }
}

const removeAllTestAddresses = async() => {
    await prismaClient.address.deleteMany({
        where : {
            contact : {
                username : "test"
            }
        }
    });
}

const createTestAddress = async() => {
    const contact = await getTestContact();
    await prismaClient.address.create({
        data : {
            contact_id : contact.id,
            street : "test",
            city : "test",
            province : "test",
            country : "test",
            postal_code : "2020"
        }
    });
}

const getTestaddress = async() => {
    return await prismaClient.address.findFirst({
        where : {
            contact : {
                username : "test"
            }
        }
    });
}

export {
    removeTestUser,
    createTestUser,
    getTestUser,
    removeAllTestContact,
    createTestContact,
    getTestContact,
    createManyTestContact,
    removeAllTestAddresses,
    createTestAddress,
    getTestaddress
}
