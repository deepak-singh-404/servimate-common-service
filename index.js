require("dotenv").config();
const { sendSMS, sendMail } = require('./controller')

module.exports.common_service = async (event) => {
    try {
        let _data = {}
        if (event['body']) {
            _data = JSON.parse(event['body'])
        }
        else {
            _data = JSON.parse(event['Records'][0]['body'])
        }
        if (_data.type === "email") {
            let result = await sendMail(_data.data);
            let respone = {
                'status': 'success',
                'code': 200,
                'result': result
            }
            return {
                statusCode: 200,
                body: JSON.stringify(respone),
            };
        }
        if (_data.type === "sms") {
            let result = await sendSMS(_data.body);
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify(result),
            }

        }
    }
    catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(error)
        }
    }
}





