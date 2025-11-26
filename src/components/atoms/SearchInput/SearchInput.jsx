import React from 'react'
import classes from './SearchInput.module.css'
import Input from '../Input/Input'
import { IoSearchSharp } from "react-icons/io5";

export default function SearchInput({placeholder = "Search",value = "",setValue = () => {}}) {
  return (
    <Input type="search" setValue={setValue} value={value} inputClass={classes.inputClass} leftIcon={<IoSearchSharp size={20} />} placeholder={placeholder} />
  )
}
