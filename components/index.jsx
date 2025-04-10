import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Link } from 'expo-router'
import { useSelector } from 'react-redux'

export default function index() {
  const userData = useSelector(state=>state.auth.userData)
  useEffect(()=>{
    console.log(userData)
  },[])
  return (
    <View className='text-white' style={{color: "white", backgroundColor: "white"}}>
      {/* <Text>Login</Text> */}
      <Link href={"/login"} style={{fontSize: 24}}>Login</Link>
      <Link href="/home" className='text-4xl'>Home</Link>
      <Link href={"/machines"} style={{fontSize: 24}}>Machines</Link>
      <Link href={"/products"} style={{fontSize: 24}}>Products</Link>
      <Link href={`/sales/purchaselogs/66d72290ee1e0a2dabce6069`} style={{fontSize: 24}}>purchase log</Link>
    </View>
  )
}