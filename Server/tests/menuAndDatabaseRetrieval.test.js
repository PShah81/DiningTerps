import {retrieveTodaysMenu, retrieveDatabase} from '../app/controllers/controller.js';
import { jest } from '@jest/globals';
import sampleMenu from './sampleMenuQuery.json';
import supertest from 'supertest';
import createServer from '../createServer.js';

beforeEach(()=>{
    jest.spyOn(console,'error').mockReset();
})

describe("testing retrieveTodaysMenu function",()=>{
    describe("mocking",()=>{ 
        const mockPool = {query: jest.fn()};
        const mockRes = {status: jest.fn(), json: jest.fn()};
        mockRes.status.mockReturnValue(mockRes);
        test("returns correct type of values", async ()=>{
            mockPool.query.mockResolvedValue(sampleMenu);
            await retrieveTodaysMenu(mockRes, mockPool);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(Object.keys(mockRes.json.mock.calls[0][0]).length).toBe(3);
        });
        test("invalid query return", async ()=>{
            mockPool.query.mockResolvedValue({});
            await retrieveTodaysMenu(mockRes, mockPool);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({});
        })
        test("the object assign works",async ()=>{
            mockPool.query.mockResolvedValue(sampleMenu);
            await retrieveTodaysMenu(mockRes, mockPool);
            let mealTimeArr = ["Breakfast", "Lunch", "Dinner"];
            let diningHallArr = ["South", "251 North", "Yahentamitsi"];
            for(let j=0; j<3; j++)
            {
                for(let i=0; i<3; i++)
                {
                    expect(Object.keys((mockRes.json.mock.calls[0][0])[diningHallArr[j]])[i]).toEqual(mealTimeArr[i]);
                }
            }
        })
    })
});

describe("testing /menu endpoint",()=>{
    test("does it send status code 200?", async ()=>{
        let response = await supertest(createServer(global.pool)).get('/menu');
        expect(response.statusCode).toBe(200);
    })
    test("does it send status code 500?", async ()=>{
        let response = await supertest(createServer(undefined)).get('/menu');
        expect(response.statusCode).toBe(500);
    })
});

describe("testing retrieveDatabase function",()=>{
    describe("mocking",()=>{
        const mockPool = {query: jest.fn()};
        const mockRes = {status: jest.fn(), send: jest.fn()};
        mockRes.status.mockReturnValue(mockRes);
        test("returns correct type of values",async ()=>{
            mockPool.query.mockResolvedValue([[{food: 'bunch of keys'}, {food: 'bunch of keys'}, {food: 'bunch of keys'}], ["garbage"], ["garbage"]]);
            await retrieveDatabase(mockRes, mockPool);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(Array.isArray(mockRes.send.mock.calls[0][0])).toBe(true);
        })
        test("invalid query return", async ()=>{
            mockPool.query.mockResolvedValue({});
            await retrieveDatabase(mockRes, mockPool);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith([]);
        })
    })
});

describe("testing /database endpoint",()=>{
    test("does it send status code 200?", async ()=>{
        let response = await supertest(createServer(global.pool)).get('/database');
        expect(response.statusCode).toBe(200);
    })
    test("does it send status code 500?", async ()=>{
        let response = await supertest(createServer(undefined)).get('/database');
        expect(response.statusCode).toBe(500);
    })
});