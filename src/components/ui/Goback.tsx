import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import AppIcon from '../../assets/icons'

export default function Goback() {
    const navigation = useNavigation()
  return (
    <TouchableOpacity onPress={()=>navigation.goBack()}>
    <AppIcon name="arrow-back" size={22} color="#000" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({})