import React from 'react';
import { UserCheck, Sliders, Split, ArrowDown, CheckCircle2, AlertOctagon } from 'lucide-react';

export const DecisionTreeDiagram = () => {
  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.75)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '20px',
      padding: '32px 24px',
      overflowX: 'auto'
    }}>
      <div style={{ minWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        
        {/* Node 1: Root - Applicant Profile */}
        <div style={{
          padding: '14px 28px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.2)'
        }}>
          <UserCheck size={20} color="#818CF8" />
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>
              Root: Applicant & Loan Profile
            </div>
            <div style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>
              Dataset Inputs (16 Features)
            </div>
          </div>
        </div>

        {/* Connector */}
        <ArrowDown size={22} color="#6366F1" />

        {/* Node 2: Feature Evaluation */}
        <div style={{
          padding: '14px 28px',
          borderRadius: '14px',
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 8px 24px rgba(6, 182, 212, 0.15)'
        }}>
          <Sliders size={20} color="#38BDF8" />
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>
              Feature Evaluation & Splitting Criteria
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              Gini Impurity / Information Gain optimization
            </div>
          </div>
        </div>

        {/* Connector */}
        <ArrowDown size={22} color="#06B6D4" />

        {/* Node 3: Decision Rules Split */}
        <div style={{
          padding: '14px 28px',
          borderRadius: '14px',
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Split size={20} color="#F59E0B" />
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>
              Internal Decision Rules
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              Sequential binary partitioning through feature thresholds
            </div>
          </div>
        </div>

        {/* Tree Branch Split Connectors */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '480px',
          position: 'relative',
          padding: '12px 0'
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '25%',
            right: '25%',
            height: '2px',
            background: 'rgba(255, 255, 255, 0.15)'
          }} />
          <div style={{
            position: 'absolute',
            top: '0',
            left: '25%',
            width: '2px',
            height: '24px',
            background: 'rgba(255, 255, 255, 0.15)'
          }} />
          <div style={{
            position: 'absolute',
            top: '0',
            right: '25%',
            width: '2px',
            height: '24px',
            background: 'rgba(255, 255, 255, 0.15)'
          }} />
        </div>

        {/* Node 4: Leaf Nodes / Final Classification */}
        <div style={{ display: 'flex', gap: '32px', width: '100%', maxWidth: '580px', justifyContent: 'center' }}>
          
          {/* Leaf 1: No Default */}
          <div style={{
            flex: 1,
            padding: '18px 20px',
            borderRadius: '14px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15)'
          }}>
            <CheckCircle2 size={28} color="#10B981" style={{ marginBottom: '8px' }} />
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#34D399', fontSize: '1.05rem' }}>
              Class 0: No Default
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '4px' }}>
              Low Risk Classification
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '4px' }}>
              Majority Class (88.39% in dataset)
            </div>
          </div>

          {/* Leaf 2: Default */}
          <div style={{
            flex: 1,
            padding: '18px 20px',
            borderRadius: '14px',
            background: 'rgba(244, 63, 94, 0.08)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: '0 8px 24px rgba(244, 63, 94, 0.15)'
          }}>
            <AlertOctagon size={28} color="#F43F5E" style={{ marginBottom: '8px' }} />
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#FB7185', fontSize: '1.05rem' }}>
              Class 1: Default
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '4px' }}>
              High Risk Classification
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '4px' }}>
              Minority Target (11.61% in dataset)
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
