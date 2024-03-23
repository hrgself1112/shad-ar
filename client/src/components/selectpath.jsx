import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDispatch, useSelector } from "react-redux"
import { updateUser } from "@/redux/slices/article-data"


let data = {
"2024":{value:"2024"},
"Transits":{value:"Transits"},
}


export function SelectBoxesforPath() {
 
  const dispatch = useDispatch()

  const ArticlesData = useSelector((state) => state.ArticlesData);
  
    const schange = (value) => {
      dispatch(updateUser({path:value}))
    }
    
  

  return (
   <> 
   <Select value={ArticlesData.path}  onValueChange={(value) => schange(value)}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select Article Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.values(data).map((data , index) => {
            return (
              <SelectItem key={index} value={data.value} >{data.value}</SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
    
    </>
  );
}
