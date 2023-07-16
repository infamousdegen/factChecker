
import "@/Cards.css";

export const Cards = () => {
  const A:string = "https://cdn.mos.cms.futurecdn.net/cCPNy2QiwA2Hf5aRdjnrte-970-80.jpg.webp";
  const B:string = "https://imgeng.jagran.com/images/2023/jun/elon-musk-vs-mark-zuckerberg1687784276923.jpg";
  const C:string = "https://library.sportingnews.com/styles/crop_style_16_9_desktop_webp/s3/2023-07/GettyImages-1534185249.jpg.webp?itok=ekmQA9Vb";
  
  const handleClick = () => {
    window.open('./factpage');
  };

  return (<>
<h1 style={{fontSize: "2.5rem",fontWeight:"bold",display:"grid",alignItems:"center",justifyContent:"center",marginLeft:"50px",marginBottom:"50px",marginTop:"50px",color:"white "}}>Verify the Facts!</h1>
<div className= "Cards">
    
    <div className="cards-1">
    <div style={{borderRadius:"10px",width:"20%",color:"white"}}> <button onClick={() => handleClick()}><img src={C} alt="H" style={{borderTopLeftRadius:"10px",borderTopRightRadius:"10px",height:"247px"}}/><h1 style={{display:"flex",justifyContent:"center", fontWeight:"bold"}}>Djokovic has cancer</h1></button></div>
    <div style={{borderRadius:"10px",width:"20%",color:"white"}}> <a href="#"><img src={A} alt="H" style={{borderTopLeftRadius:"10px",borderTopRightRadius:"10px",height:"247px"}}/><h1 style={{display:"flex", justifyContent:"center", fontWeight:"bold"}}>Real atomic bombs for Oppenheimer </h1></a> </div>
    <div style={{borderRadius:"10px",width:"20%",color:"white"}}> <a href="#"><img src={B} alt="H" style={{borderTopLeftRadius:"10px",borderTopRightRadius:"10px",height:"247px"}}/><h1 style={{display:"flex",justifyContent:"center", fontWeight:"bold"}}>Threads has more users tha Twitter  </h1></a></div>
    <div style={{borderRadius:"10px",width:"20%",color:"white"}}> <a href="#"><img src={B} alt="H" style={{borderTopLeftRadius:"10px",borderTopRightRadius:"10px",height:"247px"}}/><h1 style={{display:"flex",justifyContent:"center", fontWeight:"bold"}}>Who wins, Elon vs Zuck?</h1></a> </div>
    </div>
    
</div>

          </>
  )
}
