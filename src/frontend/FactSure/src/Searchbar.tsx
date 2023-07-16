import React, {useState} from 'react'
import {FaSearch} from "react-icons/fa";
import "@/Searchbar.css";

type setResults = {}

export const Search = ({setResults}) => {
  const [input,setInput] = useState("");

  const fetchData = (value) =>{
    fetch("../test.json")
    .then((response) => response.json())
    .then((json)=>{
      const results = json.filter((user) => {
        return value && user && user.marketTitle && user.marketTitle.toLowerCase().includes(value)
      });
      console.log(results);
    });
  } 

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  }

  return (
  <>
  <div className="input-wrapper"> 
  <FaSearch id="search-icon"/>
  <input placeholder="Search here..." value={input} onChange={(e) => handleChange(e.target.value)}/>
  
  <div></div>
  </div>
  </>
  )
}

export default Search