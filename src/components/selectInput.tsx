"use client"

import React from 'react'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Trainer } from '@/lib/features/trainer/trainerSlice';



interface SelectInputProps {
    data : Trainer[];
    placeholder? : string;
    label? : string
    onChangeHandler : (value : string) => void
    selectedValue? : string
}

const SelectInput = ({data, placeholder, label, onChangeHandler, selectedValue} : SelectInputProps) => {
    
    return (
    <Select defaultValue={selectedValue} onValueChange={onChangeHandler}>
        <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder || "Select a Item"} />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                {label && <SelectLabel>{label}</SelectLabel> }
                {data?.map((item, index) => (
                    <SelectItem key={index} value={item?._id as string}>{item?.name}</SelectItem>
                ))}
            </SelectGroup>
        </SelectContent>
    </Select>
  )
}

export default SelectInput