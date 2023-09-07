import supertest from "supertest";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";
import { createTestUser, getTestUser, removeTestUser } from "./test-util.js";
import bcrypt from "bcrypt";

describe('POST /api/users', function() {

    afterEach(async() => {
        await removeTestUser();
    });

    it('should can register new user', async() => {
        const result = await supertest(web)
        .post('/api/users')
        .send({
            username : 'test',
            password : 'test',
            name : 'test'
        });

        expect(result.status).toBe(201);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('test');
        expect(result.body.data.password).toBeUndefined();
    });

    it('should reject if request is invalid', async() => {
        const result = await supertest(web)
        .post('/api/users')
        .send({
            username : '',
            password : '',
            name : ''
        });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
        
    });

    it('should reject if username is already registered', async() => {
        let result = await supertest(web)
        .post('/api/users')
        .send({
            username : 'test',
            password : 'test',
            name : 'test'
        });

        logger.info(result.body);

        expect(result.status).toBe(201);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('test');
        expect(result.body.data.password).toBeUndefined();

        result = await supertest(web)
        .post('/api/users')
        .send({
            username : 'test',
            password : 'test',
            name : 'test'
        });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});


describe("POST /api/users/login", function(){
    beforeEach(async() => {
        await createTestUser();
    });

    afterEach(async() => {
        await removeTestUser();
    })

    it("should can login", async() => {
        const result = await supertest(web)
        .post('/api/users/login')
        .send({
            username : 'test',
            password : 'test'
        });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.token).toBeDefined();
        expect(result.body.data.token).not.toBe("test");

    });

    it("should reject login if password is wrong/invalid", async() => {
        const result = await supertest(web)
        .post('/api/users/login')
        .send({
            username : 'test',
            password : 'testx'
        });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });

    it("should reject login if username is wrong/invalid", async() => {
        const result = await supertest(web)
        .post('/api/users/login')
        .send({
            username : 'testx',
            password : 'test'
        });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe("GET /api/users/current", function(){
    beforeEach(async() => {
        await createTestUser();
    });

    afterEach(async() => {
        await removeTestUser();
    });

    it("Should get current users data", async() => {
        const result = await supertest(web)
        .get('/api/users/current')
        .set("Authorization", "test");

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("test");
        expect(result.body.data.name).toBe("test");
    });

    it("Should reject if token is invalid", async() => {
        const result = await supertest(web)
        .get('/api/users/current')
        .set("Authorization", "testx");

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
})

describe("PATCH /api/users/current", function() {
    beforeEach(async() => {
        await createTestUser();
    });

    afterEach(async() => {
        await removeTestUser();
    });

    it("Should can update user", async () => {
        const result = await supertest(web)
        .patch('/api/users/current')
        .set("Authorization", "test")
        .send({
            name : "test1",
            password : "test1",
        });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("test");
        expect(result.body.data.name).toBe("test1");

        const user = await getTestUser();
        expect(await bcrypt.compare("test1", user.password)).toBe(true);
    }); 

    it("Should can update user name", async () => {
        const result = await supertest(web)
        .patch('/api/users/current')
        .set("Authorization", "test")
        .send({
            name : "test1",
        });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("test");
        expect(result.body.data.name).toBe("test1");
    }); 

    it("Should can update user password", async () => {
        const result = await supertest(web)
        .patch('/api/users/current')
        .set("Authorization", "test")
        .send({
            password : "test1",
        });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("test");
        expect(result.body.data.name).toBe("test");
        const user = await getTestUser();
        expect(await bcrypt.compare("test1", user.password)).toBe(true);
    });

    it("Should reject if request is not valid", async () => {
        const result = await supertest(web)
        .patch('/api/users/current')
        .set("Authorization", "xxxx")
        .send({
        });
        logger.info(result);
        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    }); 
});

describe("DELETE /api/users/logout", function() {
    beforeEach(async() => {
        await createTestUser();
    });

    afterEach(async() => {
        await removeTestUser();
    });
    it("Should can logout", async() => {
        const result = await supertest(web)
        .delete('/api/users/logout')
        .set("Authorization", "test");

        logger.info(result);
        expect(result.status).toBe(200);
        expect(result.body.data).toBe("ok");

        const user = await getTestUser();
        expect(user.token).toBeNull();
    });

    it("Should reject logout if token is invalid", async() => {
        const result = await supertest(web)
        .delete('/api/users/logout')
        .set("Authorization", "testxx");

        logger.info(result);
        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});