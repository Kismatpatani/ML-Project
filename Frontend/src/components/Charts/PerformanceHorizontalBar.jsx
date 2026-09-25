import React, {useEffect,useState} from 'react';
import {getApiConfig} from '../../services/apiConfig';
export const PerformanceHorizontalBar=()=>{
 const [m,setM]=useState(null);
 useEffect(()=>{const c=new AbortController();fetch(`${getApiConfig().baseUrl.replace(/\/+$/, '')}/metrics`,{signal:c.signal}).then(r=>{if(!r.ok)throw Error('metrics unavailable');return r.json()}).then(setM).catch(()=>{});return()=>c.abort()},[]);
 if(!m)return <p>Connect to the backend to view measured model performance.</p>;
 return <div style={{display:'grid',gap:18}}>{[['Accuracy',m.test_accuracy],['Precision',m.test_precision],['Recall',m.test_recall],['F1-score',m.test_f1]].map(([label,v])=><div key={label}><div style={{display:'flex',justifyContent:'space-between'}}><b>{label}</b><b>{(v*100).toFixed(2)}%</b></div><div style={{height:12,background:'#273449',borderRadius:12}}><div style={{height:12,width:`${v*100}%`,background:'#38BDF8',borderRadius:12}}/></div></div>)}</div>;
};
