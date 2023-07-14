import {getSettings, returnSettings, modifySettings} from '../app/controllers/controller.js';
import { jest } from '@jest/globals';
import supertest from 'supertest';
import createServer from '../createServer.js';

let sampleUUID = "3134fc51-a8e0-45a2-bd97-cd2ff4f5d243";
let realUUID = "45576fc1-0bbe-4210-a501-63d1ae1c228a";
describe("testing getSettings endpoint", ()=>{
    test("does it send null?", async ()=>{
        let response = await supertest(createServer(global.pool)).get('/settings/' + sampleUUID);
        expect(response.body).toEqual({});
    })
    test("does it send actual settings?", async ()=>{
        let response = await supertest(createServer(global.pool)).get('/settings/' + realUUID);
        expect(Object.keys(response.body).length).toBeGreaterThan(0);
    })

})

describe("testing returnSettings function",()=>{
    describe("mocking database", ()=>{
        const consoleSpy = jest.spyOn(console, 'error');
        const mockPool = {query: jest.fn()};
        test("invalid query return", async ()=>{
            mockPool.query.mockResolvedValue({});
            let returnedSettings = await returnSettings(sampleUUID, mockPool);
            expect(returnedSettings).toEqual(null);
            expect(consoleSpy).toHaveBeenCalledWith('query result is not in the proper format');
        })
        test("invalid uuid", async ()=>{
            mockPool.query.mockResolvedValue([[{info: "BUNCH OF INFO"}], ["garbage"], ["garbage"]]);
            let returnedSettings = await returnSettings("abcdefg", mockPool);
            expect(returnedSettings).toEqual(null);
            expect(consoleSpy).toHaveBeenCalledWith('invalid uuid');
        });
    })

    describe("not mocking database",()=>{
        test("returns null", async ()=>{
            let returnedSettings = await returnSettings(sampleUUID, global.pool);
            expect(returnedSettings).toBe(null);
        })

        test("returns actual settings", async ()=>{
            let returnedSettings = await returnSettings('45576fc1-0bbe-4210-a501-63d1ae1c228a', global.pool);
            expect(returnedSettings).not.toBeNull();
        })
    })

})

describe("testing modifySettings function", ()=>{
    describe("mocking",()=>{
        const consoleSpy = jest.spyOn(console, 'error');
        const mockPool = {query: jest.fn()};
        const mockRes = {status: jest.fn(), send: jest.fn()};
        mockRes.status.mockReturnValue(mockRes);
        let setting;
        let operation;
        let modification;
        test("does operation smoothly", async ()=>{
            setting = "pushToken";
            operation = "create";
            modification = null;
            await modifySettings(sampleUUID, mockRes, setting, operation, modification, mockPool, returnSettings);
            expect(mockRes.status).toHaveBeenCalledWith(200);
        })
        test("failed query", async ()=>{
            setting = "pushToken";
            operation = "create";
            modification = null;
            let newMockPool = {query: () => {throw new Error("failed to connect to database")}};
            await modifySettings(sampleUUID, mockRes, setting, operation, modification, newMockPool, returnSettings);
            expect(mockRes.status).toHaveBeenCalledWith(500);
        })
        test("invalid uuid", async ()=>{
            setting = "collapsedSections";
            operation = "add";
            modification = "sampleSection";
            await modifySettings("abcdefg", mockRes, setting, operation, modification, mockPool, returnSettings);
            expect(mockRes.status).toHaveBeenCalledWith(400);
        })
        test("invalid setting", async ()=>{
            setting = "newSetting";
            operation = "add";
            modification = "sampleSection";
            await modifySettings(sampleUUID, mockRes, setting, operation, modification, mockPool, returnSettings);
            expect(mockRes.status).toHaveBeenCalledWith(400);
        })
        test("invalid operation", async ()=>{
            setting = "collapsedSections";
            operation = "create";
            modification = "sampleSection";
            await modifySettings(sampleUUID, mockRes, setting, operation, modification, mockPool, returnSettings);
            expect(mockRes.status).toHaveBeenCalledWith(400);
        })
        test("invalid modification with pushToken", async ()=>{
            setting = "pushToken";
            operation = "create";
            modification = "aX7239n";
            await modifySettings(sampleUUID, mockRes, setting, operation, modification, mockPool, returnSettings);
            expect(mockRes.status).toHaveBeenCalledWith(400);
        })
        test("invalid modification with sections", async ()=>{
            setting = "collapsedSections";
            operation = "create";
            modification = null;
            await modifySettings(sampleUUID, mockRes, setting, operation, modification, mockPool, returnSettings);
            expect(mockRes.status).toHaveBeenCalledWith(400);
        })
        
    })
})