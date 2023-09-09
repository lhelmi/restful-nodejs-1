import { prismaClient } from "../application/database"
import { ResponseError } from "../error/response-error";
import { createAddressValidation } from "../validation/address-validation";
import { getContactValidation } from "../validation/contact-validation"
import { validate } from "../validation/validation"

const create = async(user, contactId, request) => {
    contactId = validate(getContactValidation, contactId);

    const totalContactInDatabase = await prismaClient.contact.count({
        where : {
            username : user.username,
            id : contactId
        }
    });

    if(totalContactInDatabase !== 1) throw new ResponseError(404, "Contact is not found");

    const address = validate(createAddressValidation, request);
    address.contact_id = contactId;

    return await prismaClient.address.create({
        data : address,
        select : {
            id : true,
            street : true,
            city : true,
            province : true,
            country : true,
            postal_code : true
        }
    });
}

export default {
    create
}