import React, { useState } from 'react';
import { 
  User, 
  DollarSign, 
  Briefcase, 
  FileSpreadsheet, 
  ArrowRight, 
  AlertCircle, 
  RotateCcw, 
  Server
} from 'lucide-react';
import { validateLoanForm } from '../utils/validators';
import { formatCurrency } from '../utils/formatters';
import { predictionService } from '../services/predictionService';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { PredictionResultModal } from '../components/PredictionResultModal';
import { useNotification } from '../context/NotificationContext';
import { useHistory } from '../context/HistoryContext';

export const LoanPrediction = () => {
  const { addToast } = useNotification();
  const { addAssessment } = useHistory();

  // Baseline Form State covering all 16 Decision Tree features
  const defaultValues = {
    // Card 1: Demographics
    age: 35,
    education: "Bachelor's",
    maritalStatus: 'Single',
    hasDependents: 'No',

    // Card 2: Financial Profile
    income: 75000,
    creditScore: 680,
    dtiRatio: 0.35,
    hasMortgage: 'No',

    // Card 3: Employment Details
    employmentType: 'Full-time',
    monthsEmployed: 48,
    numCreditLines: 3,

    // Card 4: Loan Parameters
    loanAmount: 45000,
    interestRate: 11.5,
    loanTerm: 36,
    loanPurpose: 'Auto',
    hasCoSigner: 'No'
  };

  const [formData, setFormData] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [backendError, setBackendError] = useState(null);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for field on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleReset = () => {
    setFormData(defaultValues);
    setErrors({});
    setBackendError(null);
    addToast('Assessment form reset to default template', 'info');
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setBackendError(null);

    // Run friendly validation
    const validation = validateLoanForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      addToast('Please resolve the highlighted validation errors', 'warning');
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // Send collected data to configurable API service
      const res = await predictionService.predict(formData);

      if (res.success) {
        setPredictionResult(res.data);
        setModalOpen(true);

        // Record into history
        await addAssessment({
          loanAmount: formData.loanAmount,
          creditScore: formData.creditScore,
          prediction: res.data.prediction,
          predictionLabel: res.data.predictionLabel,
          risk: res.data.riskLevel,
          model: res.data.modelUsed,
          details: { ...formData, ...res.data }
        });

        addToast(
          res.isSimulation
            ? 'Simulation assessment completed (Backend Offline)'
            : 'Decision Tree prediction calculated successfully!',
          'success'
        );
      } else {
        setBackendError(res.error);
        addToast(res.error, 'error');
      }
    } catch (err) {
      setBackendError(err.message || 'An unexpected failure occurred while requesting prediction.');
      addToast('Failed to reach ML prediction service', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isLoading} />

      {/* Result Modal */}
      <PredictionResultModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        result={predictionResult}
        formData={formData}
        onResetForm={handleReset}
      />

      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="page-badge">ML INFERENCE ENGINE</div>
          <h1 className="page-title">Loan Default Risk Assessment</h1>
          <p className="page-subtitle">
            Enter borrower demographics, financial profile, employment history, and loan terms to evaluate default probability using the Decision Tree Classifier.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <RotateCcw size={15} />
            <span>Reset Inputs</span>
          </button>
        </div>
      </div>

      {/* Backend Error Alert */}
      {backendError && (
        <div style={{
          padding: '16px 20px',
          borderRadius: '14px',
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.35)',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertCircle size={22} color="#F43F5E" style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ color: '#FB7185', fontSize: '0.95rem' }}>
              Service Connection Error
            </strong>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0', lineHeight: 1.5 }}>
              {backendError}
            </p>
          </div>
        </div>
      )}

      {/* Main Assessment Form Grid (Four Large Cards) */}
      <form onSubmit={handlePredict}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px',
          marginBottom: '36px'
        }} className="form-two-column-grid">

          {/* ========================================================
              CARD 1 — APPLICANT DEMOGRAPHICS
             ======================================================== */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={20} color="#818CF8" />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>
                  Applicant Demographics
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Personal and household variables</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Age */}
              <div>
                <div className="input-label">
                  <label htmlFor="input-age">Age (Years)</label>
                  <span className="input-label-value">{formData.age} yrs</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    id="input-age"
                    type="number"
                    min="18"
                    max="100"
                    className={`text-input ${errors.age ? 'input-error' : ''}`}
                    value={formData.age}
                    onChange={(e) => updateField('age', e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => updateField('age', Math.max(18, Number(formData.age) - 1))}
                      style={{ padding: '10px 14px', background: 'var(--bg-segmented)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('age', Math.min(100, Number(formData.age) + 1))}
                      style={{ padding: '10px 14px', background: 'var(--bg-segmented)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      +
                    </button>
                  </div>
                </div>
                {errors.age && <div className="field-error-text"><AlertCircle size={13} /><span>{errors.age}</span></div>}
              </div>

              {/* Education Level */}
              <div>
                <div className="input-label">
                  <label>Education Level</label>
                </div>
                <div className="segmented-group">
                  {['High School', "Bachelor's", "Master's", 'PhD'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      className={`segmented-btn ${formData.education === level ? 'active' : ''}`}
                      onClick={() => updateField('education', level)}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                {errors.education && <div className="field-error-text"><AlertCircle size={13} /><span>{errors.education}</span></div>}
              </div>

              {/* Marital Status */}
              <div>
                <div className="input-label">
                  <label>Marital Status</label>
                </div>
                <div className="segmented-group">
                  {['Single', 'Married', 'Divorced'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      className={`segmented-btn ${formData.maritalStatus === status ? 'active' : ''}`}
                      onClick={() => updateField('maritalStatus', status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                {errors.maritalStatus && <div className="field-error-text"><AlertCircle size={13} /><span>{errors.maritalStatus}</span></div>}
              </div>

              {/* Has Dependents */}
              <div>
                <div className="input-label">
                  <label>Has Dependents?</label>
                </div>
                <div className="segmented-group">
                  {['No', 'Yes'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`segmented-btn ${formData.hasDependents === val ? 'active' : ''}`}
                      onClick={() => updateField('hasDependents', val)}
                    >
                      {val === 'Yes' ? 'Yes (Dependents Present)' : 'No Dependents'}
                    </button>
                  ))}
                </div>
                {errors.hasDependents && <div className="field-error-text"><AlertCircle size={13} /><span>{errors.hasDependents}</span></div>}
              </div>
            </div>
          </div>

          {/* ========================================================
              CARD 2 — FINANCIAL PROFILE
             ======================================================== */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DollarSign size={20} color="#38BDF8" />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>
                  Financial Profile
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Income, credit standing and leverage</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Annual Income (Slider + Value) */}
              <div>
                <div className="input-label">
                  <label htmlFor="slider-income">Annual Income</label>
                  <span className="input-label-value">{formatCurrency(formData.income)}</span>
                </div>
                <input
                  id="slider-income"
                  type="range"
                  min="15000"
                  max="250000"
                  step="2500"
                  className="range-slider"
                  value={formData.income}
                  onChange={(e) => updateField('income', Number(e.target.value))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B' }}>
                  <span>$15,000</span>
                  <span>$125,000</span>
                  <span>$250,000+</span>
                </div>
                {errors.income && <div className="field-error-text"><AlertCircle size={13} /><span>{errors.income}</span></div>}
              </div>

              {/* Credit Score (Slider + Value) */}
              <div>
                <div className="input-label">
                  <label htmlFor="slider-credit-score">Credit Score</label>
                  <span className="input-label-value" style={{ color: formData.creditScore >= 700 ? '#10B981' : formData.creditScore >= 600 ? '#F59E0B' : '#F43F5E' }}>
                    {formData.creditScore} {formData.creditScore >= 720 ? '(Excellent)' : formData.creditScore >= 660 ? '(Good)' : formData.creditScore >= 600 ? '(Fair)' : '(Subprime)'}
                  </span>
                </div>
                <input
                  id="slider-credit-score"
                  type="range"
                  min="300"
                  max="850"
                  step="5"
                  className="range-slider"
                  value={formData.creditScore}
                  onChange={(e) => updateField('creditScore', Number(e.target.value))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B' }}>
                  <span>300 (Poor)</span>
                  <span>580</span>
                  <span>670</span>
                  <span>850 (Exceptional)</span>
                </div>
                {errors.creditScore && <div className="field-error-text"><AlertCircle size={13} /><span>{errors.creditScore}</span></div>}
              </div>

              {/* Debt-to-Income Ratio (Slider + Value) */}
              <div>
                <div className="input-label">
                  <label htmlFor="slider-dti">Debt-to-Income Ratio (DTI)</label>
                  <span className="input-label-value">
                    {Math.round(formData.dtiRatio * 100)}% ({formData.dtiRatio})
                  </span>
                </div>
                <input
                  id="slider-dti"
                  type="range"
                  min="0.05"
                  max="0.95"
                  step="0.01"
                  className="range-slider"
                  value={formData.dtiRatio}
                  onChange={(e) => updateField('dtiRatio', parseFloat(e.target.value))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B' }}>
                  <span>5% (Low Debt)</span>
                  <span>36% (Standard)</span>
                  <span>95% (Extreme Debt)</span>
                </div>
                {errors.dtiRatio && <div className="field-error-text"><AlertCircle size={13} /><span>{errors.dtiRatio}</span></div>}
              </div>

              {/* Has Mortgage */}
              <div>
                <div className="input-label">
                  <label>Has Mortgage?</label>
                </div>
                <div className="segmented-group">
                  {['No', 'Yes'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`segmented-btn ${formData.hasMortgage === val ? 'active' : ''}`}
                      onClick={() => updateField('hasMortgage', val)}
                    >
                      {val === 'Yes' ? 'Yes (Active Mortgage)' : 'No Existing Mortgage'}
                    </button>
                  ))}
                </div>
                {errors.hasMortgage && <div className="field-error-text"><AlertCircle size={13} /><span>{errors.hasMortgage}</span></div>}
              </div>
            </div>
          </div>

          {/* ========================================================
              CARD 3 — EMPLOYMENT DETAILS
             ======================================================== */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Briefcase size={20} color="#34D399" />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>
                  Employment Details
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Career stability and trade line experience</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Employment Type */}
              <div>
                <div className="input-label">
                  <label>Employment Type</label>
                </div>
                <div className="segmented-group">
                  {['Full-time', 'Part-time', 'Self-employed', 'Unemployed'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`segmented-btn ${formData.employmentType === type ? 'active' : ''}`}
                      onClick={() => updateField('employmentType', type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {errors.employmentType && <div className="field-error-text"><AlertCircle size={13} /><span>{errors.employmentType}</span></div>}
              </div>

              {/* Months Employed (Stepper + Input) */}
              <div>
                <div className="input-label">
                  <label htmlFor="input-months-employed">Months Employed</label>
                  <span className="input-label-value">
                    {formData.monthsEmployed} mos ({(formData.monthsEmployed / 12).toFixed(1)} yrs)
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    id="input-months-employed"
                    type="number"
                    min="0"
                    max="480"
                    className={`text-input ${errors.monthsEmployed ? 'input-error' : ''}`}
                    value={formData.monthsEmployed}
                    onChange={(e) => updateField('monthsEmployed', Number(e.target.value))}
                  />
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => updateField('monthsEmployed', Math.max(0, Number(formData.monthsEmployed) - 6))}
                      style={{ padding: '10px 14px', background: 'var(--bg-segmented)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      -6m
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('monthsEmployed', Number(formData.monthsEmployed) + 6)}
                      style={{ padding: '10px 14px', background: 'var(--bg-segmented)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      +6m
                    </button>
                  </div>
                </div>
                {errors.monthsEmployed && <div className="field-error-text"><AlertCircle size={13} /><span>{errors.monthsEmployed}</span></div>}
              </div>

              {/* Active Credit Lines */}
              <div>
                <div className="input-label">
                  <label htmlFor="input-credit-lines">Number of Active Credit Lines</label>
                  <span className="input-label-value">{formData.numCreditLines} open lines</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[1, 2, 3, 4, 5, 6, 8, 10, 15].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      className={`segmented-btn ${formData.numCreditLines === cnt ? 'active' : ''}`}
                      onClick={() => updateField('numCreditLines', cnt)}
                      style={{ padding: '8px 16px', minWidth: '40px' }}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
                {errors.numCreditLines && <div className="field-error-text"><AlertCircle size={13} /><span>{errors.numCreditLines}</span></div>}
              </div>
            </div>
          </div>

          {/* ========================================================
              CARD 4 — LOAN PARAMETERS
             ======================================================== */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileSpreadsheet size={20} color="#FBBF24" />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>
                  Loan Parameters
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Requested financing terms and contract traits</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Loan Amount */}
              <div>
                <div className="input-label">
                  <label htmlFor="slider-loan-amount">Requested Loan Amount</label>
                  <span className="input-label-value">{formatCurrency(formData.loanAmount)}</span>
                </div>
                <input
                  id="slider-loan-amount"
                  type="range"
                  min="2000"
                  max="150000"
                  step="1000"
                  className="range-slider"
                  value={formData.loanAmount}
                  onChange={(e) => updateField('loanAmount', Number(e.target.value))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B' }}>
                  <span>$2,000</span>
                  <span>$75,000</span>
                  <span>$150,000</span>
                </div>
                {errors.loanAmount && <div className="field-error-text"><AlertCircle size={13} /><span>{errors.loanAmount}</span></div>}
              </div>

              {/* Interest Rate */}
              <div>
                <div className="input-label">
                  <label htmlFor="slider-interest-rate">Interest Rate (%)</label>
                  <span className="input-label-value">{formData.interestRate}% APR</span>
                </div>
                <input
                  id="slider-interest-rate"
                  type="range"
                  min="2.0"
                  max="32.0"
                  step="0.5"
                  className="range-slider"
                  value={formData.interestRate}
                  onChange={(e) => updateField('interestRate', parseFloat(e.target.value))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B' }}>
                  <span>2.0%</span>
                  <span>15.0%</span>
                  <span>32.0%</span>
                </div>
                {errors.interestRate && <div className="field-error-text"><AlertCircle size={13} /><span>{errors.interestRate}</span></div>}
              </div>

              {/* Loan Term */}
              <div>
                <div className="input-label">
                  <label>Loan Term (Duration)</label>
                </div>
                <div className="segmented-group">
                  {[12, 24, 36, 48, 60].map((term) => (
                    <button
                      key={term}
                      type="button"
                      className={`segmented-btn ${Number(formData.loanTerm) === term ? 'active' : ''}`}
                      onClick={() => updateField('loanTerm', term)}
                    >
                      {term} Mo ({term / 12} Y)
                    </button>
                  ))}
                </div>
                {errors.loanTerm && <div className="field-error-text"><AlertCircle size={13} /><span>{errors.loanTerm}</span></div>}
              </div>

              {/* Loan Purpose & Has Co-Signer (Side-by-side) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div className="input-label">
                    <label htmlFor="select-purpose">Loan Purpose</label>
                  </div>
                  <select
                    id="select-purpose"
                    className={`select-input ${errors.loanPurpose ? 'input-error' : ''}`}
                    value={formData.loanPurpose}
                    onChange={(e) => updateField('loanPurpose', e.target.value)}
                  >
                    <option value="Auto">Auto</option>
                    <option value="Business">Business</option>
                    <option value="Education">Education</option>
                    <option value="Home">Home Improvement</option>
                    <option value="Personal">Personal</option>
                  </select>
                  {errors.loanPurpose && <div className="field-error-text"><AlertCircle size={13} /><span>{errors.loanPurpose}</span></div>}
                </div>

                <div>
                  <div className="input-label">
                    <label>Has Co-Signer?</label>
                  </div>
                  <div className="segmented-group">
                    {['No', 'Yes'].map((val) => (
                      <button
                        key={val}
                        type="button"
                        className={`segmented-btn ${formData.hasCoSigner === val ? 'active' : ''}`}
                        onClick={() => updateField('hasCoSigner', val)}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  {errors.hasCoSigner && <div className="field-error-text"><AlertCircle size={13} /><span>{errors.hasCoSigner}</span></div>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Large Premium Bottom Button */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          padding: '20px 0 40px 0'
        }}>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{
              padding: '18px 48px',
              fontSize: '1.18rem',
              borderRadius: '16px',
              boxShadow: '0 8px 30px rgba(99, 102, 241, 0.45)',
              minWidth: '320px'
            }}
          >
            <span>Predict Default Risk</span>
            <ArrowRight size={22} />
          </button>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Submits 16 features to the Decision Tree classification service
          </span>
        </div>
      </form>

      <style>{`
        @media (max-width: 900px) {
          .form-two-column-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
