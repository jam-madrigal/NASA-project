const request = require('supertest');
const app = require('../../app');
const { 
    mongoConnect,
    mongoDisconnect
 } = require('../../services/mongo');

describe('Launches API', () => {
    beforeAll(async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        await mongoDisconnect();
    })

    describe('TEST GET /launches', () => {
        test('IT should respond with 200 success', async () => {
            const response = await request(app)
                .get('/v1/launches')
                //Checking our headers, checking the content type using javascript's regular expression syntax, to see if it contains json in it, and the status code
                .expect('Content-Type', /json/)
                .expect(200);
            // Assertions if we weren't using supertest's convenience like above
            // expect(response.statusCode).toBe(200);
        });
    
    });
    
    describe('TEST POST /launches', () => {
        // Setting the model of our data outside of our tests, so that we can use them as parameters, which will ensure we handle properties like the date correctly
        const completeLaunchData = {
            mission: 'Save the world',
            rocket: 'Highwind',
            target: 'Kepler-62 f',
            launchDate: 'January 31, 1997'
        };
        
        
        const launchDataWithoutDate = {
            mission: 'Save the world',
            rocket: 'Highwind',
            target: 'Kepler-62 f',
        };
        
        const launchDataWithInvalidDate = {
            mission: 'Save the world',
            rocket: 'Highwind',
            target: 'Kepler-62 f',
            launchDate: 'humba'
        };
        // Testing our success
        test('It should respond with 201 created', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);
                
                // Check that these dates are equal even if they are in different formats
                const requestDate = new Date(completeLaunchData.launchDate).valueOf();
                const responseDate = new Date(response.body.launchDate).valueOf();
                expect(responseDate).toBe(requestDate);
    
                expect(response.body).toMatchObject(launchDataWithoutDate);
        });
        // Testing our errors. We can use the same post request, but use the one missing a required value, and expect a 400 error
        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);
            // Expect an exact match for our error, the objects must have the same type and structure
            expect(response.body).toStrictEqual({
                error: 'Missing required launch property'
            });
        });
    
        test('It should catch invalid dates', async() => {
             const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400);
            // Expect an exact match for our error, the objects must have the same type and structure
            expect(response.body).toStrictEqual({
                error: 'Invalid launch date'
            });
        });
    })
});