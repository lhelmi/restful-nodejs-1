import supertest from "supertest";
import { createTestContact, createTestUser, getTestContact, removeAllTestContact, removeTestUser } from "./test-util";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";

describe("POST /api/contacts", function(){
    beforeEach(async() => {
        await createTestUser();
    });
    afterEach(async() => {
        await removeAllTestContact();
        await removeTestUser();
    });
    it("should can create new contact", async() => {
        const result = await supertest(web)
        .post('/api/contacts')
        .set('Authorization', 'test')
        .send({
            first_name : "test",
            last_name : "test",
            email : "test@t.com",
            phone : "41242121"
        });

        logger.info(result);

        expect(result.status).toBe(201);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.first_name).toBe("test");
        expect(result.body.data.last_name).toBe("test");
        expect(result.body.data.email).toBe("test@t.com");
        expect(result.body.data.phone).toBe("41242121");
    });

    it("should reject if request is invalid", async() => {
        const result = await supertest(web)
        .post('/api/contacts')
        .set('Authorization', 'test')
        .send({
            first_name : "test",
            last_name : "",
            email : "test",
            phone : "213123123123318209381209382193821093809128309182409218093"
        });

        logger.info(result);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe("GET /api/contact/:contactId", function() {
    beforeEach(async() => {
        await createTestUser();
        await createTestContact();
    });
    afterEach(async() => {
        await removeAllTestContact();
        await removeTestUser();
    });

    it("shoud can get contact by id", async() => {
        const testContact = await getTestContact();
        const contactId = testContact.id;
        
        const result = await supertest(web)
        .get(`/api/contacts/${contactId}`)
        .set("Authorization", "test");

        logger.info(result);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(contactId);
        expect(result.body.data.first_name).toBe(testContact.first_name);
        expect(result.body.data.last_name).toBe(testContact.last_name);
        expect(result.body.data.email).toBe(testContact.email);
        expect(result.body.data.phone).toBe(testContact.phone);
        expect(result.body.data.username).toBe(testContact.username);
    });

    it("shoud return 404 if contact id is not found", async() => {
        const result = await supertest(web)
        .get(`/api/contacts/9090100`)
        .set("Authorization", "test");

        logger.info(result);

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});