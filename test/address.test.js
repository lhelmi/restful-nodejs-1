import supertest from "supertest";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";
import { createTestAddress, createTestContact, createTestUser, getTestContact, getTestaddress, removeAllTestAddresses, removeAllTestContact, removeTestUser } from "./test-util";

describe("POST /api/contacts/:contactId/address", function(){
    beforeEach(async() => {
        await createTestUser();
        await createTestContact();
    });
    afterEach(async() => {
        await removeAllTestAddresses();
        await removeAllTestContact();
        await removeTestUser();
    });

    it("should can create new address", async() => {
        const testContact = await getTestContact();
        
        const result = await supertest(web)
        .post(`/api/contacts/${testContact.id}/addresses`)
        .set('Authorization', 'test')
        .send({
            street : "test",
            city : "test",
            province : "test",
            country : "test",
            postal_code : "2020"
        });

        logger.info(result);

        expect(result.status).toBe(201);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.province).toBe("test");
        expect(result.body.data.street).toBe("test");
        expect(result.body.data.city).toBe("test");
        expect(result.body.data.postal_code).toBe("2020");
        expect(result.body.data.country).toBe("test");
    });

    it("should reject if request is invalid", async() => {
        const testContact = await getTestContact();
        
        const result = await supertest(web)
        .post(`/api/contacts/${testContact.id}/addresses`)
        .set('Authorization', 'test')
        .send({
            street : "test",
            city : "",
            province : "test",
            country : "test",
            postal_code : ""
        });

        logger.info(result);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it("should reject if contact id is invalid", async() => {
        const result = await supertest(web)
        .post(`/api/contacts/2021/addresses`)
        .set('Authorization', 'test')
        .send({
            street : "test",
            city : "",
            province : "test",
            country : "test",
            postal_code : ""
        });

        logger.info(result);

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});

describe("GET /api/contacts/:contactId/address/:addressId", function(){
    beforeEach(async() => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });
    afterEach(async() => {
        await removeAllTestAddresses();
        await removeAllTestContact();
        await removeTestUser();
    });

    it("should can get address", async() => {
        const testContact = await getTestContact();
        const testAddress = await getTestaddress();
        
        const result = await supertest(web)
        .get(`/api/contacts/${testContact.id}/addresses/${testAddress.id}`)
        .set('Authorization', 'test');
        

        logger.info(result);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.province).toBe("test");
        expect(result.body.data.street).toBe("test");
        expect(result.body.data.city).toBe("test");
        expect(result.body.data.postal_code).toBe("2020");
        expect(result.body.data.country).toBe("test");
    });

    it("should reject if address id's invalid", async() => {
        const testContact = await getTestContact();
        
        const result = await supertest(web)
        .get(`/api/contacts/${testContact.id}/addresses/3000`)
        .set('Authorization', 'test');
        

        logger.info(result);

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});

describe("PUT /api/contacts/:contactId/address/:addressId", function(){
    beforeEach(async() => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });
    afterEach(async() => {
        await removeAllTestAddresses();
        await removeAllTestContact();
        await removeTestUser();
    });

    it("should can update address", async() => {
        const testContact = await getTestContact();
        const testAddress = await getTestaddress();
        
        const result = await supertest(web)
        .put(`/api/contacts/${testContact.id}/addresses/${testAddress.id}`)
        .set('Authorization', 'test')
        .send({
            street : "test1",
            city : "test1",
            province : "test1",
            country : "test1",
            postal_code : "2021"
        });
        
        logger.info(result);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testAddress.id)
        expect(result.body.data.street).toBe("test1");
        expect(result.body.data.city).toBe("test1");
        expect(result.body.data.postal_code).toBe("2021");
        expect(result.body.data.country).toBe("test1");
        expect(result.body.data.province).toBe("test1");
    });

    it("should reject if request is not valid", async() => {
        const testContact = await getTestContact();
        const testAddress = await getTestaddress();
        
        const result = await supertest(web)
        .put(`/api/contacts/${testContact.id}/addresses/${testAddress.id}`)
        .set('Authorization', 'test')
        .send({
            street : "",
            city : "test1",
            province : "test1",
            country : "",
            postal_code : "2021"
        });
        
        logger.info(result);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it("should reject if address id is not valid", async() => {
        const testContact = await getTestContact();
        
        const result = await supertest(web)
        .put(`/api/contacts/${testContact.id}/addresses/3000`)
        .set('Authorization', 'test')
        .send({
            street : "test1",
            city : "test1",
            province : "test1",
            country : "test1",
            postal_code : "2021"
        });
        
        logger.info(result);

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});

describe("DELETE /api/contacts/:contactId/address/:addressId", function(){
    beforeEach(async() => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });
    afterEach(async() => {
        await removeAllTestAddresses();
        await removeAllTestContact();
        await removeTestUser();
    });

    it("should can remove address cotnact", async() => {
        const testContact = await getTestContact();
        const testAddress = await getTestaddress();
        
        const result = await supertest(web)
        .delete(`/api/contacts/${testContact.id}/addresses/${testAddress.id}`)
        .set('Authorization', 'test');
        
        logger.info(result);

        expect(result.status).toBe(200);
        expect(result.body.data).toBe("ok");
    });

    it("should reject if address is not found", async() => {
        const testContact = await getTestContact();
        const testAddress = await getTestaddress();
        
        const result = await supertest(web)
        .delete(`/api/contacts/${testContact.id}/addresses/${testAddress.id + 1}`)
        .set('Authorization', 'test');
        
        logger.info(result);

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});

describe("GET /api/contacts/:contactId/addresses", function(){
    beforeEach(async() => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });
    afterEach(async() => {
        await removeAllTestAddresses();
        await removeAllTestContact();
        await removeTestUser();
    });

    it("should can get list addresses by contact id", async() => {
        const testContact = await getTestContact();
        
        const result = await supertest(web)
        .get(`/api/contacts/${testContact.id}/addresses`)
        .set('Authorization', 'test');
        
        logger.info(result);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1);
    });

    it("should reject is contact id is not found", async() => {
        const testContact = await getTestContact();
        
        const result = await supertest(web)
        .get(`/api/contacts/${testContact.id + 10000}/addresses`)
        .set('Authorization', 'test');
        
        logger.info(result);

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});