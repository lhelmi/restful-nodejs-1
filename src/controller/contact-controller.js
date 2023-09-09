import contactService from "../service/contact-service";

const create = async(req, res, next) => {
    try {
        const user = req.user;
        const request = req.body;
        const result = await contactService.create(user, request);

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
        const contactId = req.params.contactId;

        const result = await contactService.get(user, contactId);
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
        const request = req.body;
        const contactId = req.params.contactId;
        request.id = contactId;
        
        const result = await contactService.update(user, request);

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
        const contactId = req.params.contactId;

        await contactService.remove(user, contactId);
        return res.status(200).json({
            data : "ok"
        });
    } catch (error) {
        next(error);
    }
}

export default {
    create,
    get,
    update,
    remove
}