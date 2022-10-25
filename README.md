# C02 Calculator API

Back-end application for the CO2 Calculator. Created using Node.js | Express.

## Installation 

After cloning the repository run:

### `npm i`

That command will install the necessary dependencies. After that you can run the application with:

### `node index.js`

or use the Run/Debug function of an IDE of your preference. Now the application is running on http://localhost:3999

## API

The route responsable for the calculation is: **/calculate** (POST)

* Example of a **request body**: 

```json
{
  "monthly_electric_bill_value": 100, //Numeric
  "monthly_gas_bill_value": 100, //Numeric
  "monthly_oil_bill_value": 100, //Numeric
  "car_miles_per_year": 100, //Numeric
  "num_short_flights_per_year": 1, //Numeric
  "num_long_flights_per_year": 1, //Numeric
  "recicle_newspaper": false, //Boolean
  "recicle_aluminium": false //Boolean
}
```

All fields are required, even if the value is 0.

* Example of **response** (200): 

```json
{
  "result": "HIGH", //String
  "co2_sum": 38229 //Numeric
}

```

* If you send an invalid type, the response will be an **error** (400):
```json
{
  "errors": [
      {
          "value": "100 dollars",
          "msg": "Invalid value",
          "param": "monthly_electric_bill_value",
          "location": "body"
      }
  ]
}

```
