import {getFavoriteFoodIds} from '../helperFunctions.js';
import { jest } from '@jest/globals';
import {validate as isUUID} from 'uuid';
import {v4 as uuidv4} from 'uuid';

describe("testing getFavoriteFoodIds", ()=>{
    describe("mocking database", ()=>{
        const mockPool = {query: jest.fn()};
        test("returns the correct values", async ()=>{
            mockPool.query.mockResolvedValue([[{food_id: '13154'}, {food_id: '13157'}, {food_id: '13160'}], ["garbage"], ["garbage"]]);
            let favoriteFoodIds = await getFavoriteFoodIds(uuidv4(), mockPool);
            expect(favoriteFoodIds).toEqual(['13154', '13157', '13160']);
            expect(mockPool.query.mock.calls.length).toBe(1);
        })  
        test("invalid query return", async ()=>{
            const consoleSpy = jest.spyOn(console, 'log');
            mockPool.query.mockResolvedValue({});
            let favoriteFoodIds = await getFavoriteFoodIds(uuidv4(), mockPool);
            expect(favoriteFoodIds).toEqual([]);
            expect(consoleSpy.mock.calls[0][0]).toBe('invalid query result');
        })
        test("there is an error with the query", async() => {
            const consoleSpy = jest.spyOn(console, 'log');
            const diffMockPool = {query: jest.fn(()=>{
                throw new Error("query error")
            })};
            let favoriteFoodIds = await getFavoriteFoodIds(uuidv4(), diffMockPool);
            expect(favoriteFoodIds).toEqual([]);
            expect(consoleSpy.mock.calls[1][0]).toBe('query error');
        })
    })
    describe("not mocking database", ()=> {
        test("invalid uuid", async ()=>{
            const consoleSpy = jest.spyOn(console, 'log');
            const favoriteFoodIds = await getFavoriteFoodIds("abcdefg", global.pool);
            expect(favoriteFoodIds).toEqual([]);
            expect(consoleSpy.mock.calls[2][0]).toBe('invalid uuid');
        });
        test("uuid that doesn't have any favorites", async( )=>{
            //very low chance that this failes because uuidv4 might 
            //return a uuid in the database
            const consoleSpy = jest.spyOn(console, 'log');
            const favoriteFoodIds = await getFavoriteFoodIds(uuidv4(),global.pool);
            expect(favoriteFoodIds).toEqual([]);
            expect(consoleSpy.mock.calls.length).toBe(3);
        });
    })

})