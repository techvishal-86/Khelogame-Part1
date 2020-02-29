/**
 * production API
 * https://api.cashfree.com/api/v2/cftoken/order
 * clientId: '309831a309c31f95ea4692f3738903'
 * clientSecret: 'e77730ac07e782d87007c8a9205fdfddf1a4d6a8'
 * 
 * development API
 * https://test.cashfree.com/api/v2/cftoken/order
 * clientId: '9603b1a4f7ebc6b6ca47f9673069',
 * clientSecret: '29924beada93a3fff5f664b42ef187b4a93940ba'
 */
export const checkOutAPI = {
    url: 'https://test.cashfree.com/api/v2/cftoken/order',
    clientId: '9603b1a4f7ebc6b6ca47f9673069',
    clientSecret: '29924beada93a3fff5f664b42ef187b4a93940ba'
};

/**
 * production API
 * https://payout-api.cashfree.com
 * development API
 * https://payout-gamma.cashfree.com
 */
export const payOutAPI = {
    url: 'https://payout-gamma.cashfree.com',
};

/**
 * production API for data
 * https://khelogame.net
 * development API for data
 * http://<localhostip>:3000
 */
export const dataAPI = 'http://192.168.1.112:3000';

export const groupRegExp = {
    nameRX: /^[a-z]([-']?[a-z]+)*( [a-z]([-']?[a-z]+)*)+$/i,
    emailRX: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    phoneRX: /^1?(\([2-9]\d{2}\)|[2-9]\d{2})[2-9]\d{6}$/,
    accountRX: /^\d{9,18}$/,
    ifscRX: /^[A-Za-z]{4}[a-zA-Z0-9]{7}$/,
    addressRX: /^[a-zA-Z0-9\s,.'-]{3,}$/,
    pincodeRX: /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/,
    cityRX: /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/,
    stateRX: /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/,
};
