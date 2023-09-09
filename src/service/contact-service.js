import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { createContactValidation, getContactValidation, searchContactValidation, updateContactValidation } from "../validation/contact-validation"
import { validate } from "../validation/validation"

const create = async(user, request) => {
    const contact = validate(createContactValidation, request);
    contact.username = user.username;

    return prismaClient.contact.create({
        data : contact,
        select : {
            id : true,
            first_name : true,
            last_name : true,
            email : true,
            phone : true
        }
    });
}

const get = async(user, contactId) => {
    contactId = validate(getContactValidation, contactId);

    const contact = await prismaClient.contact.findFirst({
        where : {
            username : user.username,
            id : contactId
        },
        select : {
            id : true,
            first_name : true,
            last_name : true,
            email : true,
            phone : true,
            username : true
        }
    });

    if(!contact) throw new ResponseError(404, "contact is not found");

    return contact;
}

const update = async(user, request) => {
    const contact = validate(updateContactValidation, request);

    const totalCountContact = await prismaClient.contact.count({
        where : {
            username : user.username,
            id : contact.id
        }
    });

    if(!totalCountContact) throw new ResponseError(404, "contact is not found");

    return prismaClient.contact.update({
        where : {
            username : user.username,
            id : contact.id
        },
        data : {
            first_name : contact.first_name,
            last_name : contact.last_name,
            email : contact.email,
            phone : contact.phone
        },
        select : {
            id : true,
            first_name : true,
            last_name : true,
            email : true,
            phone : true         
        }
    });
}

const remove = async(user, contactId) => {
    contactId = validate(getContactValidation, contactId);

    const contact = await prismaClient.contact.count({
        where : {
            id : contactId,
            username : user.username
        }
    });

    if(contact !== 1) throw new ResponseError(404, "Contact not found");

    return prismaClient.contact.delete({
        where : {
            id : contactId
        }
    });
}

const search = async(user, request) => {
    request = validate(searchContactValidation, request);
    let filters = [];

    filters.push({
        username : user.username
    });
    
    if(request.name){
        filters.push({
            OR : [
                {
                    first_name : {
                        contains : request.name
                    }
                },
                {
                    last_name : {
                        contains : request.name
                    }
                }
            ]
        });
    }

    if(request.email){
        filters.push({
            email : {
                contains : request.email
            }
        });
    }

    if(request.phone){
        filters.push({
            phone : {
                contains : request.phone
            }
        });
    }

    let skip = ((request.page - 1) * request.size);
    const contacts = await prismaClient.contact.findMany({
        where: {
            AND: filters
        },
        take: request.size,
        skip: skip
    });

    const totalItem = await prismaClient.contact.count({
        where : {
            AND : filters
        }
    });

    return {
        data : contacts,
        paging : {
            page : request.page,
            total_item : totalItem,
            total_page : Math.ceil(totalItem/request.size)
        }
    }
}

export default {
    create,
    get,
    update,
    remove,
    search
}