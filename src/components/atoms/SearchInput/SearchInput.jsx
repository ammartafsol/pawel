import React from 'react'
import classes from './SearchInput.module.css'
import Input from '../Input/Input'
import { IoSearchSharp } from "react-icons/io5";
import { mergeClass } from '@/resources/utils/helper';

export default function SearchInput({placeholder = "Search",value = "",setValue = () => {},inputClass = ""}) {
  return (
    <Input type="search" setValue={setValue} value={value} inputClass={inputClass || classes.inputClass} leftIcon={<IoSearchSharp size={20} />} placeholder={placeholder} />
  )
}
