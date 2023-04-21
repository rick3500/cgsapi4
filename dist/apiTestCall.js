"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const apiUrl = 'http://localhost:4007/api/transaction';
// Define sample transaction data
const transaction = {
    uniqueID: '12345',
    requestName: 'Sample Request',
    categoryName: 'Sample Category',
    status: 'inprogress',
    itemNumbers: [1, 2, 3],
    payload: {
        foo: 'bar',
        baz: 123,
    },
};
// Call the API with the sample data
axios_1.default.post(apiUrl, transaction)
    .then(response => {
    console.log('API response:', response.data);
})
    .catch(error => {
    console.error('API error:', error);
});
//# sourceMappingURL=apiTestCall.js.map