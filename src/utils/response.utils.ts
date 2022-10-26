import {HTTP_CONSTANTS} from "./http.cosntants";

const header = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Credentials': true
};

export default class ResponseUtils {
    /**
     * ResponseUtils - To generate final response structure
     */
    public static generateResponse(statusCode, responseData) {
        switch (statusCode) {
            case HTTP_CONSTANTS.STATUS.SYSTEM_ERROR:
                return {
                    statusCode: HTTP_CONSTANTS.STATUS.SYSTEM_ERROR,
                    body: JSON.stringify({
                        error: {
                            code: 'GENERIC_ERROR',
                            type: 'SystemException',
                            message: responseData
                        }
                    }),
                    headers: header
                };
            case HTTP_CONSTANTS.STATUS.PRECONDITON_FAILED: {

                if (typeof responseData === 'string') {
                    return {
                        statusCode: HTTP_CONSTANTS.STATUS.PRECONDITON_FAILED,
                        body: JSON.stringify({
                            error: {
                                code: 'INVALID_REQUEST_PARAMS',
                                message: responseData,
                                type: 'BusinessException',
                            }
                        }),
                        headers: header
                    };
                } else {
                    return {
                        statusCode: HTTP_CONSTANTS.STATUS.PRECONDITON_FAILED,
                        body: JSON.stringify({
                            error: {
                                code: responseData.data ? responseData.data['errorCode'] : responseData['code'],
                                message: responseData.data ? responseData.data['errorMessage'] : responseData['message'],
                                type: 'BusinessException',
                            }
                        }),
                        headers: header
                    };
                }
            }
            case HTTP_CONSTANTS.STATUS.UN_AUTHORIZED: {
                return {
                    statusCode: HTTP_CONSTANTS.STATUS.UN_AUTHORIZED,
                    body: JSON.stringify(responseData),
                    headers: header
                };
            }
            case HTTP_CONSTANTS.STATUS.SUCCESS: {
                return {
                    statusCode: statusCode,
                    body: responseData,
                    headers: header
                };
            }

        }
    }

    /**
     * ResponseUtils - To generate final response structure
     */
    public static generateBinaryResponse(responseData, type, filename) {
        const responseHeader = new Object(header);
        responseHeader['Content-Type'] = type;
        responseHeader['Content-Disposition'] = `attachment;filename=${filename}`;
        return {
            statusCode: HTTP_CONSTANTS.STATUS.SUCCESS,
            body: responseData,
            headers: responseHeader
        };
    }
}