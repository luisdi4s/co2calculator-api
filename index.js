var express = require('express')
var bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator');

const convert_to_pounds_of_co2 = {
	electricity_or_gas: (bill) => { if (bill) return bill * 105; else return 0 },
	oil: (bill) => { if (bill) return bill * 113; else return 0 },
	car: (miles) => { if (miles) return miles * 0.79; else return 0 },
	short_flights: (number) => { if (number) return number * 1100; else return 0 },
	long_flights: (number) => { if (number) return number * 4400; else return 0 },
	paper: (res) => { if (!res) return 184 ; else return 0 },
	aluminium: (res) => { if (!res) return 166 ; else return 0 }
}

const constants = {
	port: 3999,
	success_status_code: 200,
	error_status_code: 500,
	invalid_request_body_code: 400
}

var app = express()

app.use(function(_, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

var jsonParser = bodyParser.json()

app.listen(constants.port)

app.post('/calculate', jsonParser,
	[body('monthly_electric_bill_value').isNumeric(),
	body('monthly_gas_bill_value').isNumeric(),
	body('monthly_oil_bill_value').isNumeric(),
	body('car_miles_per_year').isNumeric(),
	body('num_short_flights_per_year').isNumeric(),
	body('num_long_flights_per_year').isNumeric(),
	body('recicle_newspaper').isBoolean(),
	body('recicle_aluminium').isBoolean()],
	function (req, res)  {
		const errors = validationResult(req);
		
    if (!errors.isEmpty()) {
      return res.status(constants.invalid_request_body_code).json({ errors: errors.array() });
    }

		try {
			const electricity_co2 = convert_to_pounds_of_co2["electricity_or_gas"](req.body.monthly_electric_bill_value)
			const gas_co2 = convert_to_pounds_of_co2["electricity_or_gas"](req.body.monthly_gas_bill_value)
			const oil_co2 = convert_to_pounds_of_co2["oil"](req.body.monthly_oil_bill_value)
			const car_co2 = convert_to_pounds_of_co2["car"](req.body.car_miles_per_year)
			const short_flights_co2 = convert_to_pounds_of_co2["short_flights"](req.body.num_short_flights_per_year)
			const long_flights_co2 = convert_to_pounds_of_co2["long_flights"](req.body.num_long_flights_per_year)
			const recicle_newspaper = convert_to_pounds_of_co2["paper"](req.body.recicle_newspaper)
			const recicle_aluminium = convert_to_pounds_of_co2["aluminium"](req.body.recicle_aluminium)

			const co2_sum = electricity_co2 + gas_co2 + oil_co2 + car_co2 + short_flights_co2 + long_flights_co2 + recicle_newspaper + recicle_aluminium

			let result = ''

			if (co2_sum < 6000) {
				result = 'VERY LOW'
			} else if (co2_sum >= 6000 && co2_sum < 16000) {
				result = 'LOW'
			} else if (co2_sum >= 16000 && co2_sum < 22000) {
				result = 'AVERAGE'
			} else {
				result = 'HIGH'
			}

			res.status(constants.success_status_code)
			res.json({
				result: result,
				co2_sum: co2_sum
			})
		} catch {
			res.status(constants.error_status_code)
			res.send("Internal Server Error")
		}
})