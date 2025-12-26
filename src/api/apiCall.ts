import api from './axiosInstance'

export const loginwithGoogleApi = async (token: String) => {
    console.log(token)
    try {
        const response = await api.post('/api/auth/login/google', {
            idToken: token
        })

        return response
    } catch (error) {
        console.log(error)
    }
}

export const getAllCodes = async () => {

    try {
        const response = await api.get('/api/auth/authenticators')
        return response
    } catch (error) {
        console.log(error)
    }
}

export const addCodesApi = async (appName: String, secret: String) => {
    try {
        const response = await api.post('/api/auth/authenticator/import', {
            appName: appName,
            secret:secret
        })
        return response
    } catch (error) {
        console.log(error)
    }
}

export const deletCode =()=>{}