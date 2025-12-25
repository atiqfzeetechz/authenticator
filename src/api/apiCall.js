import api from '../api/axiosInstance'

export const loginwithGoogleApi  = async (token)=>{
    console.log(token)
   try{
    const response = await api.post('/api/auth/login/google',{
        idToken:token
    })

    return response
   }catch(error){
    console.log(error)
   }
}