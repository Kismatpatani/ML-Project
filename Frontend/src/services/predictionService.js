import { getApiConfig } from './apiConfig';

/**
 * Service to communicate with the ML Backend API for Loan Default Prediction.
 * Sends applicant data to the configured Decision Tree Classifier endpoint.
 */
export const predictionService = {
  /**
   * Send the 16 applicant and loan features to the Decision Tree prediction endpoint.
   * @param {Object} rawFormData - The form inputs collected from the assessment UI.
   * @returns {Promise<{success: boolean, data?: Object, error?: string, rawResponse?: any}>}
   */
  async predict(rawFormData) {
    const config = getApiConfig();
    const targetUrl = `${config.baseUrl.replace(/\/+$/, '')}${config.predictEndpoint}`;

    const payload = {
      // Numerical features
      Age: Number(rawFormData.age),
      Income: Number(rawFormData.income),
      LoanAmount: Number(rawFormData.loanAmount),
      CreditScore: Number(rawFormData.creditScore),
      MonthsEmployed: Number(rawFormData.monthsEmployed),
      NumCreditLines: Number(rawFormData.numCreditLines),
      InterestRate: Number(rawFormData.interestRate),
      LoanTerm: Number(rawFormData.loanTerm),
      DTIRatio: Number(rawFormData.dtiRatio),

      // Categorical features
      Education: String(rawFormData.education),
      EmploymentType: String(rawFormData.employmentType),
      MaritalStatus: String(rawFormData.maritalStatus),
      HasMortgage: String(rawFormData.hasMortgage),
      HasDependents: String(rawFormData.hasDependents),
      LoanPurpose: String(rawFormData.loanPurpose),
      HasCoSigner: String(rawFormData.hasCoSigner)
    };

    if (config.simulationMode) {
      await new Promise(r => setTimeout(r, 1600));
      return {
        success: true,
        isSimulation: true,
        data: {
          prediction: 0,
          predictionLabel: 'No Default',
          modelUsed: 'Decision Tree Classifier',
          probability: 0.12,
          notes: 'Simulation Mode active. Connect live ML backend for real predictions.'
        }
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs || 15000);

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Prediction could not be completed.");
      }

      const resData = await response.json();
      
      let rawPrediction = resData.prediction !== undefined ? resData.prediction : (resData.result || resData.prediction_label);
      let isDefault = false;

      if (typeof rawPrediction === 'number') {
        isDefault = rawPrediction === 1;
      } else if (typeof rawPrediction === 'string') {
        isDefault = rawPrediction.toLowerCase().includes('default') && !rawPrediction.toLowerCase().includes('no');
      }

      const predictionLabel = isDefault ? 'Default' : 'No Default';
      const probability = resData.probability ?? resData.confidence ?? resData.risk_probability ?? null;
      const riskLevel = resData.risk_level ?? resData.risk ?? (isDefault ? 'High Risk' : 'Low Risk');

      return {
        success: true,
        isSimulation: false,
        data: {
          prediction: isDefault ? 1 : 0,
          predictionLabel,
          riskLevel,
          probability: probability !== null ? Number(probability) : null,
          modelUsed: resData.model_used || 'Decision Tree Classifier',
          rawResponse: resData,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Prediction API call failed:', error);
      const isConnectionError = error.name === 'TypeError' || error.name === 'AbortError' || error.message.includes('fetch');
      return {
        success: false,
        error: isConnectionError 
          ? "Unable to connect to prediction server. Please make sure the backend is running." 
          : "Prediction could not be completed."
      };
    }
  }
};
