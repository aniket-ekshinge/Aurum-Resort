import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <>
      <Helmet><title>404 — Aurum Resort</title></Helmet>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'70vh',textAlign:'center',padding:'2rem'}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:'120px',fontWeight:900,color:'rgba(201,168,76,0.12)',lineHeight:1}}>404</div>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'36px',color:'var(--cream)',margin:'-1.5rem 0 1rem'}}>Page Not Found</h1>
        <p style={{color:'var(--smoke)',marginBottom:'2rem',maxWidth:'400px',fontFamily:"'Cormorant Garamond',serif",fontSize:'18px',fontStyle:'italic'}}>Even the most well-travelled guest sometimes loses their way. Allow us to guide you home.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}><span>Return to Aurum</span></button>
      </div>
    </>
  );
}
