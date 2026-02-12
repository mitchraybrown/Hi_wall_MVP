import { useEffect } from 'react'

export function Badge({ status }) {
  const colors = {
    approved: { bg: 'var(--gb)', tx: 'var(--gt)', dot: 'var(--gn)' },
    pending: { bg: 'var(--ab)', tx: 'var(--at)', dot: 'var(--am)' },
    denied: { bg: 'var(--rb)', tx: 'var(--rt)', dot: 'var(--rd)' },
    booked: { bg: 'var(--bb)', tx: 'var(--bt)', dot: 'var(--bl)' },
    new: { bg: 'var(--bb)', tx: 'var(--bt)', dot: 'var(--bl)' },
    contacted: { bg: 'var(--ab)', tx: 'var(--at)', dot: 'var(--am)' },
    converted: { bg: 'var(--gb)', tx: 'var(--gt)', dot: 'var(--gn)' },
    archived: { bg: 'var(--bg)', tx: 'var(--mu)', dot: 'var(--mu)' },
  }
  const c = colors[status] || colors.pending
  return <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:.4,background:c.bg,color:c.tx}}><span style={{width:6,height:6,borderRadius:'50%',background:c.dot}}/>{status}</span>
}

export function Btn({ children, variant = 'primary', style: sx, ...p }) {
  const b = {border:'none',borderRadius:10,fontWeight:600,fontSize:14,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:8,transition:'all .2s',lineHeight:1}
  const v = {
    primary:{...b,background:'var(--co)',color:'#fff',padding:'11px 22px'},
    secondary:{...b,background:'var(--wh)',color:'var(--ink)',padding:'10px 20px',border:'1.5px solid var(--ln)'},
    ghost:{...b,background:'transparent',color:'var(--sl)',padding:'8px 14px'},
    danger:{...b,background:'var(--rb)',color:'var(--rt)',padding:'10px 18px',border:'1px solid #FCA5A5'},
    success:{...b,background:'var(--gb)',color:'var(--gt)',padding:'10px 18px',border:'1px solid #6EE7B7'},
  }
  return <button style={{...v[variant],...sx}} {...p}>{children}</button>
}

export function Inp({ label, error, required, style: sx, inputStyle, children, ...p }) {
  const s = {width:'100%',padding:'10px 13px',border:`1.5px solid ${error?'var(--co)':'var(--ln)'}`,borderRadius:10,fontSize:14,color:'var(--ink)',background:'var(--wh)',outline:'none',...inputStyle}
  return <div style={{marginBottom:15,...sx}}>
    {label && <label style={{display:'block',fontSize:13,fontWeight:600,marginBottom:4}}>{label}{required && <span style={{color:'var(--co)'}}> *</span>}</label>}
    {p.type === 'textarea' ? <textarea {...p} type={undefined} style={{...s,resize:'vertical'}} rows={p.rows||3}/>
     : p.type === 'select' ? <select {...p} type={undefined} style={{...s,cursor:'pointer'}}>{children}</select>
     : <input {...p} style={s}/>}
    {error && <span style={{fontSize:11,color:'var(--co)',marginTop:2,display:'block'}}>{error}</span>}
  </div>
}

export function Card({ children, style: sx, className = '', ...p }) {
  return <div className={className} style={{background:'var(--wh)',borderRadius:'var(--rl)',border:'1px solid var(--ln)',boxShadow:'0 1px 3px rgba(0,0,0,.06)',...sx}} {...p}>{children}</div>
}

export function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t) }, [onClose])
  return <div style={{position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',background:'var(--ink)',color:'#fff',padding:'12px 24px',borderRadius:12,fontWeight:500,fontSize:14,zIndex:9999,animation:'fu .3s',boxShadow:'0 12px 40px rgba(0,0,0,.12)',display:'flex',alignItems:'center',gap:9}}><span style={{color:'var(--gn)'}}>✓</span>{msg}</div>
}

export function Overlay({ children, onClose }) {
  return <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',backdropFilter:'blur(4px)',zIndex:1000,display:'flex',justifyContent:'center',alignItems:'flex-start',padding:'40px 20px',overflowY:'auto',animation:'fi .2s'}}><div onClick={e=>e.stopPropagation()} style={{animation:'si .3s'}}>{children}</div></div>
}

export function Spinner() {
  return <div style={{display:'flex',justifyContent:'center',padding:40}}><div style={{width:32,height:32,border:'3px solid var(--ln)',borderTopColor:'var(--co)',borderRadius:'50%',animation:'spin .6s linear infinite'}}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>
}
