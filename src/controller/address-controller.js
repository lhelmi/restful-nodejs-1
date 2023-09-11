import addressService from "../service/address-service.js";

const create = async(req, res, next) => {
    try {
        const user = req.user;
        const request = req.body;
        const contactId = req.params.contactId;

        const result = await addressService.create(user, contactId, request);
        return res.status(201).json({
            data : result
        });
    } catch (error) {
        next(error);
    }
}

const get = async(req, res, next) => {
    try {
        const user = req.user;
        const addressId = req.params.addressId;
        const contactId = req.params.contactId;

        const result = await addressService.get(user, contactId, addressId);
        return res.status(200).json({
            data : result
        });
    } catch (error) {
        next(error);
    }
}

const update = async(req, res, next) => {
    try {
        const user = req.user;
        const addressId = req.params.addressId;
        const contactId = req.params.contactId;
        const request = req.body;
        request.id = addressId;

        const result = await addressService.update(user, contactId, request);
        return res.status(200).json({
            data : result
        });
    } catch (error) {
        next(error);
    }
}

const remove = async(req, res, next) => {
    try {
        const user = req.user;
        const addressId = req.params.addressId;
        const contactId = req.params.contactId;
        
        await addressService.remove(user, contactId, addressId);

        return res.status(200).json({
            data : "ok"
        });
    } catch (error) {
        next(error);
    }
}

const list = async(req, res, next) => {
    try {
        const user = req.user;
        const contactId = req.params.contactId;
        
        const address = await addressService.list(user, contactId);
        
        return res.status(200).json({
            data : address
        });
    } catch (error) {
        next(error);
    }
}

export default{
    create,
    get,
    update,
    remove,
    list
}