import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { Card, Btn, Inp, Badge, Spinner } from '../components/ui'

export default function PartnersPage({ toast }) {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState(false)
  const [f, sF] = useState({ company:'', services:'', portfolio_url:'', contact_email:'' })
  const [sending, setSending] = useState(false)

  useEffect(() => {
    supabase.from('partners').select('*').eq('status','approved').then(({ data }) => {
      setPartners(data || [])
      setLoading(false)
    })
  }, [])

  const submit = async () => {
    if (!f.company || !f.services || !f.contact_email) return
    setSending(true)
    const { error } = await supabase.from('partners').insert(f)
    setSending(false)
    if (error) { toast('Error — try again'); return }
    sF({ company:'', services:'', portfolio_url:'', contact_email:'' })
    setShow(false)
    toast('Application submitted!')
  }

  if (loading) return <Spinner />

  return <div style={{maxWidth:900,margin:'0 auto',padding:'32px 24px 52px'}}>
    <div className="au" style={{marginBottom:24}}>
      <h1 style={{fontFamily:'var(--fd)',fontSize:26,fontWeight:700,marginBottom:6}}>Partner Network</h1>
      <p style={{color:'var(--sl)',fontSize:14,lineHeight:1.7,maxWidth:560}}>Agencies, production teams, and specialist operators handle creative, approvals workflows, install, and content capture. Hi Wall stays focused on the marketplace: inventory, compliance readiness, booking, and governance.</p>
    </div>

    <Card className="au d1" style={{padding:'24px 28px',marginBottom:24,background:'linear-gradient(135deg,#1A1A2E,#2D2B55)',border:'none'}}>
      <h3 style={{fontFamily:'var(--fd)',fontSize:17,fontWeight:700,color:'#fff',marginBottom:12}}>Delivered Through Partners</h3>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:14}}>
        {[{i:'🎨',t:'Creative',d:'Concept, design, and artwork'},{i:'🔧',t:'Production',d:'Preparation and materials'},{i:'🏗️',t:'Install',d:'On-wall delivery and finishing'},{i:'📸',t:'Content Capture',d:'Photo, video, and social assets'}].map((s,j)=><div key={j} style={{background:'rgba(255,255,255,.06)',borderRadius:10,padding:14,border:'1px solid rgba(255,255,255,.08)'}}><div style={{fontSize:16,marginBottom:6}}>{s.i}</div><div style={{fontSize:13,fontWeight:600,color:'#fff',marginBottom:2}}>{s.t}</div><div style={{fontSize:12,color:'rgba(255,255,255,.5)'}}>{s.d}</div></div>)}
      </div>
    </Card>

    {partners.length > 0 && <>
      <h3 className="au d2" style={{fontSize:16,fontWeight:600,marginBottom:10}}>Approved Partners</h3>
      {partners.map(p => <Card key={p.id} style={{padding:'14px 18px',marginBottom:8,display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:40,height:40,borderRadius:10,background:'var(--col)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🤝</div>
        <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{p.company}</div><div style={{fontSize:12,color:'var(--mu)'}}>{p.services}</div></div>
        <Badge status="approved"/>
      </Card>)}
    </>}

    <Card className="au d3" style={{padding:28,marginTop:24,textAlign:'center'}}>
      <h3 style={{fontFamily:'var(--fd)',fontSize:20,fontWeight:700,marginBottom:6}}>Become a Partner</h3>
      <p style={{color:'var(--mu)',fontSize:14,marginBottom:16,maxWidth:400,margin:'0 auto 16px'}}>Join our network of approved creative and production partners.</p>
      {!show ? <Btn onClick={() => setShow(true)}>Apply Now →</Btn>
      : <div style={{maxWidth:400,margin:'0 auto',textAlign:'left'}}>
          <Inp label="Company Name" required value={f.company} onChange={e => sF({...f, company:e.target.value})} placeholder="Company"/>
          <Inp label="Services" required value={f.services} onChange={e => sF({...f, services:e.target.value})} placeholder="Creative, Production, Install..."/>
          <Inp label="Portfolio URL" value={f.portfolio_url} onChange={e => sF({...f, portfolio_url:e.target.value})} placeholder="https://..."/>
          <Inp label="Contact Email" required type="email" value={f.contact_email} onChange={e => sF({...f, contact_email:e.target.value})} placeholder="hello@company.com"/>
          <div style={{display:'flex',gap:8}}>
            <Btn variant="secondary" onClick={() => setShow(false)} style={{flex:1,justifyContent:'center'}}>Cancel</Btn>
            <Btn onClick={submit} disabled={sending} style={{flex:1,justifyContent:'center'}}>{sending ? 'Submitting...' : 'Submit'}</Btn>
          </div>
        </div>}
    </Card>
  </div>
}
