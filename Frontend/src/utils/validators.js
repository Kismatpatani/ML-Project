/**
 * Friendly form validation rules for Loan Default Assessment and Login
 */

export const validateLoanForm = (data) => {
  const errors = {};

  // Card 1: Applicant Demographics
  if (data.age === undefined || data.age === '' || isNaN(data.age)) {
    errors.age = 'Please enter applicant age';
  } else if (data.age < 18) {
    errors.age = 'Applicant must be at least 18 years old';
  } else if (data.age > 100) {
    errors.age = 'Please specify a valid age between 18 and 100';
  }

  if (!data.education) {
    errors.education = 'Please select education level';
  }

  if (!data.maritalStatus) {
    errors.maritalStatus = 'Please select marital status';
  }

  if (!data.hasDependents) {
    errors.hasDependents = 'Please specify whether applicant has dependents';
  }

  // Card 2: Financial Profile
  if (data.income === undefined || data.income === '' || isNaN(data.income)) {
    errors.income = 'Please enter annual income';
  } else if (Number(data.income) < 0) {
    errors.income = 'Annual income cannot be negative';
  }

  if (data.creditScore === undefined || data.creditScore === '' || isNaN(data.creditScore)) {
    errors.creditScore = 'Please enter a credit score';
  } else if (Number(data.creditScore) < 300 || Number(data.creditScore) > 850) {
    errors.creditScore = 'Credit score must be between 300 and 850';
  }

  if (data.dtiRatio === undefined || data.dtiRatio === '' || isNaN(data.dtiRatio)) {
    errors.dtiRatio = 'Please specify debt-to-income (DTI) ratio';
  } else if (Number(data.dtiRatio) < 0 || Number(data.dtiRatio) > 1) {
    errors.dtiRatio = 'DTI ratio must be between 0.00 and 1.00 (0% - 100%)';
  }

  if (!data.hasMortgage) {
    errors.hasMortgage = 'Please specify mortgage status';
  }

  // Card 3: Employment Details
  if (!data.employmentType) {
    errors.employmentType = 'Please select employment type';
  }

  if (data.monthsEmployed === undefined || data.monthsEmployed === '' || isNaN(data.monthsEmployed)) {
    errors.monthsEmployed = 'Please enter months employed';
  } else if (Number(data.monthsEmployed) < 0) {
    errors.monthsEmployed = 'Months employed cannot be negative';
  }

  if (data.numCreditLines === undefined || data.numCreditLines === '' || isNaN(data.numCreditLines)) {
    errors.numCreditLines = 'Please specify number of active credit lines';
  } else if (Number(data.numCreditLines) < 0) {
    errors.numCreditLines = 'Active credit lines cannot be negative';
  }

  // Card 4: Loan Parameters
  if (data.loanAmount === undefined || data.loanAmount === '' || isNaN(data.loanAmount)) {
    errors.loanAmount = 'Please enter loan amount requested';
  } else if (Number(data.loanAmount) <= 0) {
    errors.loanAmount = 'Loan amount must be greater than $0';
  }

  if (data.interestRate === undefined || data.interestRate === '' || isNaN(data.interestRate)) {
    errors.interestRate = 'Please enter interest rate';
  } else if (Number(data.interestRate) <= 0 || Number(data.interestRate) > 50) {
    errors.interestRate = 'Interest rate must be between 0.1% and 50%';
  }

  if (!data.loanTerm || Number(data.loanTerm) <= 0) {
    errors.loanTerm = 'Please specify loan duration';
  }

  if (!data.loanPurpose) {
    errors.loanPurpose = 'Please select loan purpose';
  }

  if (!data.hasCoSigner) {
    errors.hasCoSigner = 'Please specify whether a co-signer is present';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateLoginForm = (email, password) => {
  const errors = {};
  if (!email || !email.trim()) {
    errors.email = 'Please enter your work email address';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email format (e.g. analyst@fintech.io)';
  }

  if (!password) {
    errors.password = 'Please enter your password';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
