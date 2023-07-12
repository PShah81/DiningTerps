import {getFavoriteFoodIds, returnFavoritesAvailable} from '../app/controllers/controller.js';
import { jest } from '@jest/globals';
import sampleMenu from './sampleMenuQuery.json';

//tests that use this without database mocking may fail if this uuid does exist in the system
let sampleUUID = "3134fc51-a8e0-45a2-bd97-cd2ff4f5d243";
beforeEach(()=>{
    jest.spyOn(console,'error').mockReset();
})
describe("testing getFavoriteFoodIds", ()=>{

    describe("mocking database", ()=>{
        const mockPool = {query: jest.fn()};
        test("returns the correct values", async ()=>{
            mockPool.query.mockResolvedValue([[{food_id: 13154}, {food_id: 13157}, {food_id: 13160}], ["garbage"], ["garbage"]]);
            let favoriteFoodIds = await getFavoriteFoodIds(sampleUUID, mockPool);
            expect(favoriteFoodIds).toEqual([13154, 13157, 13160]);
            expect(mockPool.query.mock.calls.length).toBe(1);
        })  
        test("invalid query return", async ()=>{
            const consoleSpy = jest.spyOn(console, 'error');
            mockPool.query.mockResolvedValue({});
            let favoriteFoodIds = await getFavoriteFoodIds(sampleUUID, mockPool);
            expect(favoriteFoodIds).toEqual([]);
            expect(consoleSpy).toBeCalledWith('invalid query result');
        })
        test("invalid uuid", async ()=>{
            const consoleSpy = jest.spyOn(console, 'error');
            mockPool.query.mockResolvedValue([[{food_id: 13154}, {food_id: 13157}, {food_id: 13160}], ["garbage"], ["garbage"]]);
            let favoriteFoodIds = await getFavoriteFoodIds("abcdefg", mockPool);
            expect(favoriteFoodIds).toEqual([]);
            expect(consoleSpy).toBeCalledWith('invalid uuid');
        });
    })


    describe("not mocking database", ()=> {
        test("uuid that doesn't have any favorites", async( )=>{
            //very low chance that this failes because uuidv4 might 
            //return a uuid in the database
            const consoleSpy = jest.spyOn(console, 'error');
            let favoriteFoodIds = await getFavoriteFoodIds(sampleUUID,global.pool);
            expect(favoriteFoodIds).toEqual([]);
            expect(consoleSpy.mock.calls.length).toBe(0);
        });
    })

})




describe("testing returnFavoritesAvailable", ()=>{
    describe("mocking database and getFavoriteFoodIds", ()=>{
        const mockPool = {query: jest.fn()};
        const mockFavoriteFoodIds = (uuid, pool) => [13265, 13320, 13355, 13361];
        test("returns the correct values", async ()=>{
            mockPool.query.mockResolvedValue(sampleMenu);
            let responseObject = await returnFavoritesAvailable(sampleUUID, mockPool, mockFavoriteFoodIds);
            expect(mockPool.query.mock.calls.length).toBe(1);

            expect(Object.keys(responseObject['favoritesAvailable']['South']['Breakfast']).length).toBe(0);
            expect(Object.keys(responseObject['favoritesAvailable']['South']['Lunch']).length).toBe(2);
            expect(Object.keys(responseObject['favoritesAvailable']['South']['Dinner']).length).toBe(2);

            expect(Object.keys(responseObject['favoritesAvailable']['251 North']['Breakfast']).length).toBe(0);
            expect(Object.keys(responseObject['favoritesAvailable']['251 North']['Lunch']).length).toBe(1);
            expect(Object.keys(responseObject['favoritesAvailable']['251 North']['Dinner']).length).toBe(1);

            expect(Object.keys(responseObject['favoritesAvailable']['Yahentamitsi']['Breakfast']).length).toBe(0);
            expect(Object.keys(responseObject['favoritesAvailable']['Yahentamitsi']['Lunch']).length).toBe(2);
            expect(Object.keys(responseObject['favoritesAvailable']['Yahentamitsi']['Dinner']).length).toBe(3);
        })
        
        test("invalid query return", async ()=>{
            const consoleSpy = jest.spyOn(console, 'error');
            mockPool.query.mockResolvedValue({});
            let responseObject = await returnFavoritesAvailable(sampleUUID, mockPool, mockFavoriteFoodIds);
            expect(responseObject["favoriteFoodIds"]).toEqual([]);
            expect(responseObject["favoritesAvailable"]).toEqual({});
            expect(consoleSpy).toBeCalledWith('menuResults is not in the proper format');
        })

        test("there is an error with getting data from getFavoriteFoodIds", async() => {
            const consoleSpy = jest.spyOn(console, 'error');
            const newMockFavoriteFoodIds = (uuid, pool) => {};
            mockPool.query.mockResolvedValue(sampleMenu);
            let responseObject = await returnFavoritesAvailable(sampleUUID, mockPool, newMockFavoriteFoodIds);
            expect(responseObject["favoriteFoodIds"]).toEqual([]);
            expect(responseObject["favoritesAvailable"]).toEqual({});
            expect(consoleSpy).toBeCalledWith('Favorite food array is not valid');
        })
    })
    describe("no mocking", () => {
        test("favoriteFoodIds is empty array for uuid with no favorites", async ()=>{  
            let responseObject = await returnFavoritesAvailable(sampleUUID, global.pool, getFavoriteFoodIds);
            expect(responseObject['favoriteFoodIds']).toEqual([]);
        })
    })
})



describe("testing getFavoritesAvailable", ()=>{
    
})