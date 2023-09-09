import supertest from "supertest";
import { createManyTestContact, createTestContact, createTestUser, getTestContact, removeAllTestContact, removeTestUser } from "./test-util";
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

    it("should can get contact by id", async() => {
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

    it("should return 404 if contact id is not found", async() => {
        const result = await supertest(web)
        .get(`/api/contacts/9090100`)
        .set("Authorization", "test");

        logger.info(result);

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});

describe("PUT /api/contacts/:contactId", function(){
    beforeEach(async() => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async() => {
        await removeAllTestContact();
        await removeTestUser();
    });

    it("should can update existing contact", async() => {
        const testContact = await getTestContact();
        
        const result = await supertest(web)
        .put(`/api/contacts/${testContact.id}`)
        .set('Authorization', 'test')
        .send({
            first_name : 'test1',
            last_name : 'test1',
            email : 'test1@t.com',
            phone : '0812312412'
        });

        logger.info(result);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testContact.id);
        expect(result.body.data.first_name).toBe("test1");
        expect(result.body.data.last_name).toBe("test1");
        expect(result.body.data.email).toBe("test1@t.com");
        expect(result.body.data.phone).toBe("0812312412");
    });

    it("should reject if request is invalid", async() => {
        const testContact = await getTestContact();
        
        const result = await supertest(web)
        .put(`/api/contacts/${testContact.id}`)
        .set('Authorization', 'test')
        .send({
            first_name : 'test1',
            last_name : '',
            email : 'test1',
            phone : 'asd'
        });

        logger.info(result);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it("should reject if contact id is invalid", async() => {
        const result = await supertest(web)
        .put(`/api/contacts/9090090`)
        .set('Authorization', 'test')
        .send({
            first_name : 'test1',
            last_name : 'tes11',
            email : 'test1@as.com',
            phone : '123123'
        });

        logger.info(result);

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});

describe("DELETE /api/contacts/:contactId", function(){
    beforeEach(async() => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async() => {
        await removeAllTestContact();
        await removeTestUser();
    });

    it("should can delete contact", async() => {
        const testContact = await getTestContact();
        
        const result = await supertest(web)
        .delete(`/api/contacts/${testContact.id}`)
        .set('Authorization', 'test');

        logger.info(result);

        expect(result.status).toBe(200);
        expect(result.body.data).toBe("ok");
    });

    it("should reject if contact id is invalid", async() => {
        const result = await supertest(web)
        .delete(`/api/contacts/4000`)
        .set('Authorization', 'test');

        logger.info(result);

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});

describe("GET /api/contacts", function(){
    beforeEach(async() => {
        await createTestUser();
        await createManyTestContact();
    });

    afterEach(async() => {
        await removeAllTestContact();
        await removeTestUser();
    });

    it("should can search without parameter", async() => {
        const result = await supertest(web)
        .get("/api/contacts")
        .set("Authorization", "test");
        logger.info(result);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(10);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);
    });

    it("should can search without parameter : page 2", async() => {
        const result = await supertest(web)
        .get("/api/contacts")
        .query({
            'page': '2'
        })
        .set("Authorization", "test");
        console.log(result);
        logger.info(result);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(5);
        expect(result.body.paging.page).toBe(2);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);
    });

    it("should can search with param : name", async() => {
        const result = await supertest(web)
        .get("/api/contacts")
        .query({
            'name' : "first test 1"
        })
        .set("Authorization", "test");
        logger.info(result);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });

    it("should can search with param : email", async() => {
        const result = await supertest(web)
        .get("/api/contacts")
        .query({
            'email' : "test1"
        })
        .set("Authorization", "test");
        logger.info(result);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });
    it("should can search with param : phone", async() => {
        const result = await supertest(web)
        .get("/api/contacts")
        .query({
            'phone' : "0010"
        })
        .set("Authorization", "test");
        logger.info(result);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(1);
    });

    it("should can search with param : name, phone", async() => {
        const result = await supertest(web)
        .get("/api/contacts")
        .query({
            'name' : 'test 1',
            'phone' : "0010"
        })
        .set("Authorization", "test");
        logger.info(result);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(1);
    });
    
});