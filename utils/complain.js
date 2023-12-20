import { setUserData } from '../app/store/features/userSlice';
import api from './index'


export const createComplain = async(data)=>{
    try {
     const createdComplain = await api.post('/api/complains',{
           data:{
            ...data
           }
          
        })
            return createdComplain?.data

    } catch (error) {
        console.log("Error creating the complain ",error.message,data)
    }
}
export const getUserByPhoneNumber = async(phone)=>{
    try {
        // Remove the "+" symbol
        // +201144254129
        if(phone){
            
            const user =    await api.get(`/api/users?filters[$and][0][phoneNumber][$eq]=`+phone)
            if(user?.data[0] && user?.data[0]?.phoneNumber) {
                setUserData(user?.data[0])
                
                return user?.data[0]
            }
            else {
                return null

            } 
        } 
    } catch (error) {
        console.log("Error creating the user ",error.message)
    }
}

export const getUserById= async(id)=>{
    try {
        if(id){
            
            const user = await api.get(`/api/users/${id}?populate=*`)
            return user?.data
        } 
    } catch (error) {
        console.log("Error getting the user ",error.message)
    }
}
export const getUserCurrentOrders= async(id)=>{
    try {
        // Remove the "+" symbol
        // +201144254129
        if(id){
            
            const user = await api.get(`/api/users/${id}?populate=*`)
            return user?.data?.orders
        } 
    } catch (error) {
        console.log("Error getting the user ",error.message)
    }
}
export const updateUserData = async(id,data)=>{
try {
   const updatedUser =  await api.put(`/api/users/${id}`,{
        ...data
    })
    if(updateUserData) return true
    return false
} catch (error) {
    console.log('error updating the user ',error.message) 
}
}
export const updateProviderData = async(id,data)=>{
try {
   const updatedUser =  await api.put(`/api/providers/${id}`,{
        ...data
    })
    if(updateUserData) return true
    return false
} catch (error) {
    console.log('error updating the provider ',error.message) 
}
}