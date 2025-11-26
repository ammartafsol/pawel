import React from 'react'
import classes from './SearchInput.module.css'
import Input from '../Input/Input'
import { IoSearchSharp } from "react-icons/io5";

export default function SearchInput() {
  return (
    <Input type="search" inputClass={classes.inputClass} leftIcon={<IoSearchSharp size={20} />} placeholder="Search" />
  )
}
