import {addOrDeleteFavorites} from '../app/controllers/controller.js';
import { jest } from '@jest/globals';
import supertest from 'supertest';
import createServer from '../createServer.js';

let sampleUUID = "3134fc51-a8e0-45a2-bd97-cd2ff4f5d243";
describe("testing addOrDeleteFavorites function", ()=>{

    describe("mocking database", ()=>{
        const consoleSpy = jest.spyOn(console, 'error');
        const mockPool = {query: jest.fn()};
        const mockRes = {status: jest.fn(), send: jest.fn()};
        mockRes.status.mockReturnValue(mockRes);
        test("returns the correct values", async ()=>{
            const logSpy = jest.spyOn(console, 'log');
            mockPool.query.mockResolvedValue([[], ["garbage"], ["garbage"]]);
            await addOrDeleteFavorites("add", sampleUUID, 14000, mockRes, mockPool);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(logSpy).toHaveBeenCalledWith("added");
        })  
        test("invalid query return", async ()=>{
            mockPool.query.mockResolvedValue([{}]);
            await addOrDeleteFavorites("add", sampleUUID, 14000, mockRes, mockPool);
            expect(consoleSpy).toHaveBeenCalledWith('query result not in proper format');
            expect(mockRes.status).toHaveBeenCalledWith(500);
        })
        test("invalid uuid", async ()=>{
            mockPool.query.mockResolvedValue([["something"], ["garbage"], ["garbage"]]);
            await addOrDeleteFavorites("add", "abcdefg", 14000, mockRes, mockPool);
            expect(consoleSpy).toHaveBeenCalledWith('invalid uuid');
        });
    })
})