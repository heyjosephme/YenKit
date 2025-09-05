import type { TaxBracket, Prefecture } from "./schemas";

// 2024 Income Tax Brackets (Progressive)
export const INCOME_TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 1950000, rate: 0.05 },
  { min: 1950001, max: 3300000, rate: 0.10 },
  { min: 3300001, max: 6950000, rate: 0.20 },
  { min: 6950001, max: 9000000, rate: 0.23 },
  { min: 9000001, max: 18000000, rate: 0.33 },
  { min: 18000001, max: 400000000, rate: 0.40 },
  { min: 400000001, max: Infinity, rate: 0.45 },
];

// Standard deductions and rates
export const STANDARD_DEDUCTION = 380000; // Basic deduction for income tax
export const RECONSTRUCTION_SURTAX_RATE = 0.021; // 2.1% on income tax
export const RESIDENT_TAX_RATE = 0.10; // ~10% (combined municipal + prefectural)

// Social insurance rates (2024)
export const SOCIAL_INSURANCE = {
  PENSION_RATE: 0.183, // 18.3% total (9.15% employee + 9.15% employer)
  EMPLOYEE_PENSION_RATE: 0.0915, // Employee portion only
  EMPLOYMENT_INSURANCE_RATE: 0.006, // ~0.6% (varies by industry)
  NURSING_CARE_AGE_THRESHOLD: 40,
  NURSING_CARE_RATE: 0.0159, // 1.59% additional for age 40-64
};

// Prefecture health insurance rates (sample - varies by location)
export const PREFECTURES: Prefecture[] = [
  { name: "Tokyo", healthInsuranceRate: 0.0991 },
  { name: "Osaka", healthInsuranceRate: 0.1018 },
  { name: "Kanagawa", healthInsuranceRate: 0.0991 },
  { name: "Okinawa", healthInsuranceRate: 0.0944 },
  { name: "Saga", healthInsuranceRate: 0.1078 },
  // Add more as needed
];

// Employment income deduction brackets (給与所得控除)
export const EMPLOYMENT_INCOME_DEDUCTION_BRACKETS = [
  { min: 0, max: 1625000, formula: (income: number) => 550000 }, // Minimum deduction
  { min: 1625001, max: 1800000, formula: (income: number) => income * 0.4 - 100000 },
  { min: 1800001, max: 3600000, formula: (income: number) => income * 0.3 + 80000 },
  { min: 3600001, max: 6600000, formula: (income: number) => income * 0.2 + 440000 },
  { min: 6600001, max: 8500000, formula: (income: number) => income * 0.1 + 1100000 },
  { min: 8500001, max: Infinity, formula: (income: number) => 1950000 }, // Maximum deduction
];