import {
  INCOME_TAX_BRACKETS,
  STANDARD_DEDUCTION,
  RECONSTRUCTION_SURTAX_RATE,
  RESIDENT_TAX_RATE,
  SOCIAL_INSURANCE,
  FREELANCER_INSURANCE,
  PREFECTURES,
  EMPLOYMENT_INCOME_DEDUCTION_BRACKETS,
} from "./constants";

import { logger } from "./logger";

import type { 
  SalaryInput, 
  SalaryBreakdown, 
  TaxCalculation, 
  SocialInsurance, 
  ResidentTax 
} from "./schemas";

/**
 * Calculate employment income deduction (給与所得控除)
 */
export function calculateEmploymentIncomeDeduction(grossSalary: number): number {
  logger.debug(`Calculating employment income deduction for ¥${grossSalary.toLocaleString()}`);
  
  const bracket = EMPLOYMENT_INCOME_DEDUCTION_BRACKETS.find(
    (bracket) => grossSalary >= bracket.min && grossSalary <= bracket.max
  );
  
  if (!bracket) {
    logger.error(`Invalid salary amount for deduction calculation: ¥${grossSalary.toLocaleString()}`);
    throw new Error("Invalid salary amount for deduction calculation");
  }
  
  const deduction = Math.floor(bracket.formula(grossSalary));
  logger.debug(`Employment income deduction: ¥${deduction.toLocaleString()}`);
  
  return deduction;
}

/**
 * Calculate progressive income tax
 */
export function calculateIncomeTax(taxableIncome: number): TaxCalculation {
  const adjustedTaxableIncome = Math.max(0, taxableIncome - STANDARD_DEDUCTION);
  let incomeTax = 0;
  
  for (const bracket of INCOME_TAX_BRACKETS) {
    if (adjustedTaxableIncome <= bracket.min) break;
    
    const taxableInBracket = Math.min(
      adjustedTaxableIncome - bracket.min,
      bracket.max - bracket.min
    );
    
    if (taxableInBracket > 0) {
      incomeTax += taxableInBracket * bracket.rate;
    }
  }
  
  incomeTax = Math.floor(incomeTax);
  const reconstructionSurtax = Math.floor(incomeTax * RECONSTRUCTION_SURTAX_RATE);
  const totalNationalTax = incomeTax + reconstructionSurtax;
  
  return {
    taxableIncome: adjustedTaxableIncome,
    incomeTax,
    reconstructionSurtax,
    totalNationalTax,
  };
}

/**
 * Calculate social insurance premiums
 */
export function calculateSocialInsurance(
  grossSalary: number, 
  age: number, 
  prefecture: string,
  employmentType: string = 'regular'
): SocialInsurance {
  // Freelancers pay national insurance (cheaper but still significant)
  if (employmentType === 'freelance') {
    // National pension: Fixed amount regardless of income
    const pensionInsurance = FREELANCER_INSURANCE.NATIONAL_PENSION_ANNUAL;
    
    // National health insurance: Based on income, varies by municipality
    // Using taxable income base for more accurate calculation
    const taxableIncome = grossSalary - calculateEmploymentIncomeDeduction(grossSalary);
    const healthInsurance = Math.floor(taxableIncome * FREELANCER_INSURANCE.NATIONAL_HEALTH_INSURANCE_RATE);
    
    // Nursing care insurance for 40+ (part of national health insurance)
    const nursingCareInsurance = age >= SOCIAL_INSURANCE.NURSING_CARE_AGE_THRESHOLD 
      ? Math.floor(taxableIncome * FREELANCER_INSURANCE.NURSING_CARE_RATE)
      : 0;
    
    // No employment insurance for freelancers
    const employmentInsurance = 0;
    
    const totalSocialInsurance = healthInsurance + nursingCareInsurance + pensionInsurance + employmentInsurance;
    
    logger.debug(`Freelancer insurance: Health ¥${healthInsurance.toLocaleString()}, Pension ¥${pensionInsurance.toLocaleString()}, Nursing ¥${nursingCareInsurance.toLocaleString()}`);
    
    return {
      healthInsurance,
      nursingCareInsurance,
      pensionInsurance,
      employmentInsurance,
      totalSocialInsurance,
    };
  }
  
  // Employee social insurance calculations
  // Find prefecture health insurance rate
  const prefectureData = PREFECTURES.find(p => p.name === prefecture);
  const healthInsuranceRate = prefectureData?.healthInsuranceRate || 0.0991; // Default to Tokyo rate
  
  const healthInsurance = Math.floor(grossSalary * healthInsuranceRate * 0.5); // Employee pays half
  const nursingCareInsurance = age >= SOCIAL_INSURANCE.NURSING_CARE_AGE_THRESHOLD 
    ? Math.floor(grossSalary * SOCIAL_INSURANCE.NURSING_CARE_RATE * 0.5) // Employee pays half
    : 0;
  
  const pensionInsurance = Math.floor(grossSalary * SOCIAL_INSURANCE.EMPLOYEE_PENSION_RATE);
  const employmentInsurance = Math.floor(grossSalary * SOCIAL_INSURANCE.EMPLOYMENT_INSURANCE_RATE);
  
  const totalSocialInsurance = healthInsurance + nursingCareInsurance + pensionInsurance + employmentInsurance;
  
  return {
    healthInsurance,
    nursingCareInsurance,
    pensionInsurance,
    employmentInsurance,
    totalSocialInsurance,
  };
}

/**
 * Calculate resident tax (住民税)
 */
export function calculateResidentTax(taxableIncome: number): ResidentTax {
  const totalResidentTax = Math.floor(taxableIncome * RESIDENT_TAX_RATE);
  const prefecturalTax = Math.floor(totalResidentTax * 0.4); // ~4%
  const municipalTax = totalResidentTax - prefecturalTax; // ~6%
  
  return {
    prefecturalTax,
    municipalTax,
    totalResidentTax,
  };
}

/**
 * Main salary calculation function
 */
export function calculateSalary(input: SalaryInput): SalaryBreakdown {
  const { annualGrossSalary, age, prefecture, employmentType } = input;
  
  logger.info(`Starting salary calculation for ¥${annualGrossSalary.toLocaleString()}, age ${age}, ${prefecture}, ${employmentType}`);
  
  // Step 1: Calculate employment income deduction
  const employmentIncomeDeduction = calculateEmploymentIncomeDeduction(annualGrossSalary);
  const taxableIncome = annualGrossSalary - employmentIncomeDeduction;
  logger.debug(`Taxable income: ¥${taxableIncome.toLocaleString()}`);
  
  // Step 2: Calculate income tax
  const taxation = calculateIncomeTax(taxableIncome);
  logger.debug(`Total national tax: ¥${taxation.totalNationalTax.toLocaleString()}`);
  
  // Step 3: Calculate social insurance (varies by employment type)
  const socialInsurance = calculateSocialInsurance(annualGrossSalary, age, prefecture, employmentType);
  logger.debug(`Total social insurance: ¥${socialInsurance.totalSocialInsurance.toLocaleString()}`);
  
  // Step 4: Calculate resident tax
  const residentTax = calculateResidentTax(taxableIncome);
  logger.debug(`Total resident tax: ¥${residentTax.totalResidentTax.toLocaleString()}`);
  
  // Step 5: Calculate net salary
  const totalDeductions = taxation.totalNationalTax + socialInsurance.totalSocialInsurance + residentTax.totalResidentTax;
  const netAnnual = annualGrossSalary - totalDeductions;
  const netMonthly = Math.floor(netAnnual / 12);
  
  logger.info(`Calculation complete: Net monthly ¥${netMonthly.toLocaleString()}`);
  
  return {
    grossAnnual: annualGrossSalary,
    grossMonthly: Math.floor(annualGrossSalary / 12),
    employmentIncomeDeduction,
    taxableIncome,
    taxation,
    socialInsurance,
    residentTax,
    totalDeductions,
    netAnnual,
    netMonthly,
  };
}