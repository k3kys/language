import request from "supertest"
import { app } from "../../app"

// signup.test.ts
it("successful signup returns a 201", async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            name: "john",
            email: "test@test.com",
            password: "password",
            confirmPassword: "password",
            role: "student"
        })
        .expect(201);
});

it("provide an invalid email returns a 400", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "wrong-eamil",
            password: "password"
        })
        .expect(400)
})

it('provide an invalid password returns a 400', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: '1'
        })
        .expect(400);
});

it("missing email or password returns a 400", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com"
        })
        .expect(400)

    await request(app)
        .post('/api/users/signup')
        .send({
            password: 'password'
        })
        .expect(400);
});

it('signup with duplicate email returns a 400', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            name: "john",
            email: "test@test.com",
            password: "password",
            confirmPassword: "password",
            role: "student"
        })
        .expect(201);

    await request(app)
        .post('/api/users/signup')
        .send({
            name: "john",
            email: "test@test.com",
            password: "password",
            confirmPassword: "password",
            role: "student"
        })
        .expect(400);
});

it('sets a cookie after successful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            name: "john",
            email: "test@test.com",
            password: "password",
            confirmPassword: "password",
            role: "student"
        })
        .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
});

//signin.test.ts
it('when a email that does not exist is supplied returns 400', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
});

it('when an incorrect password is supplied returns a 400', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            name: "john",
            email: "test@test.com",
            password: "password",
            confirmPassword: "password",
            role: "student"
        })
        .expect(201);

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'wrog-password'
        })
        .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            name: "john",
            email: "test@test.com",
            password: "password",
            confirmPassword: "password",
            role: "student"
        })
        .expect(201);

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
});

//signout.test.ts
it('clears the cookie after signing out', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            name: "john",
            email: "test@test.com",
            password: "password",
            confirmPassword: "password",
            role: "student"
        })
        .expect(201);

    const response = await request(app)
        .post('/api/users/signout')
        .send({})
        .expect(200);

    expect(response.get('Set-Cookie')[0]).toContain(
        "jwt=loggedout;"
    );
});

//currentUser.test.ts
it('responds with details about the current user', async () => {
    const authResponse = await request(app)
        .post('/api/users/signup')
        .send({
            name: "john",
            email: "test@test.com",
            password: "password",
            confirmPassword: "password",
            role: "student"
        })
        .expect(201);

    const cookie = authResponse.get("Set-Cookie")

    const response = await request(app)
        .get('/api/users/currentUser')
        .set("Cookie", cookie)
        .send()
        .expect(200);

    expect(response.body.currentUser.email).toEqual("test@test.com");


});

it('responds with null if not authenticated', async () => {
    const response = await request(app)
        .get('/api/users/currentUser')
        .send()
        .expect(200);

    expect(response.body.currentUser).toEqual(null);
});

