import axios from "axios";

const apiUrl = "http://localhost:4007/api/transaction";

// Define sample transaction data
const transaction = {
  uniqueID: "12346",
  requestName: "Sample Request 2",
  categoryName: "Sample Category",
  status: "inprogress",
  itemNumbers: [1, 2, 3],

  payload: {
    foo: "fish",
    baz: 345,
  },
};

// Call the API with the sample data
axios
  .post(apiUrl, transaction)
  .then((response) => {
    console.log("API response:", response.data);
  })
  .catch((error) => {
    console.error("API error:", error);
  });
