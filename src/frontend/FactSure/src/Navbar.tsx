import { useEffect, useState } from "react";
import signin from './assets/signin.png';

import B from "./assets/Fact.png"


type Props = {}

export const Navbar = (props: Props) => {
 
  
  return (<>
    
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"900px"}}>
    <img src = {B} style={{width:"270px", objectFit:"cover"}}/>
      
        
        <a style={{fontWeight:"bold",color:"white",fontSize:"1.25rem",marginLeft:"1350px"}}>SignUp</a>
    </div>

    </>
  )
}

export default Navbar;