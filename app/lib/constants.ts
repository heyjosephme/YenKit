import type { TaxBracket, Prefecture } from "./schemas";

// 2024 Income Tax Brackets (Progressive)
export const INCOME_TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 1950000, rate: 0.05 },
  { min: 1950001, max: 3300000, rate: 0.1 },
  { min: 3300001, max: 6950000, rate: 0.2 },
  { min: 6950001, max: 9000000, rate: 0.23 },
  { min: 9000001, max: 18000000, rate: 0.33 },
  { min: 18000001, max: 400000000, rate: 0.4 },
  { min: 400000001, max: Infinity, rate: 0.45 },
];

// Standard deductions and rates
export const STANDARD_DEDUCTION = 380000; // Basic deduction for income tax
export const RECONSTRUCTION_SURTAX_RATE = 0.021; // 2.1% on income tax
export const RESIDENT_TAX_RATE = 0.1; // ~10% (combined municipal + prefectural)

// Social insurance rates (2024)
export const SOCIAL_INSURANCE = {
  PENSION_RATE: 0.183, // 18.3% total (9.15% employee + 9.15% employer)
  EMPLOYEE_PENSION_RATE: 0.0915, // Employee portion only
  EMPLOYMENT_INSURANCE_RATE: 0.006, // ~0.6% (varies by industry)
  NURSING_CARE_AGE_THRESHOLD: 40,
  NURSING_CARE_RATE: 0.0159, // 1.59% additional for age 40-64
};

// Freelancer social insurance (2024)
export const FREELANCER_INSURANCE = {
  NATIONAL_PENSION_MONTHLY: 16980, // Fixed monthly amount for 2024
  NATIONAL_PENSION_ANNUAL: 16980 * 12, // ¥203,760 per year

  // National health insurance varies by municipality and income
  // Rough estimate: 10-11% of income (income-based + per-capita + asset-based)
  NATIONAL_HEALTH_INSURANCE_RATE: 0.105, // ~10.5% average

  // Nursing care insurance for 40-64 age group
  NURSING_CARE_RATE: 0.015, // ~1.5% for freelancers
};

// Freelancer tax deductions (2024)
export const FREELANCER_DEDUCTIONS = {
  // Blue form filing special deduction (青色申告特別控除)
  BLUE_FORM_65_DEDUCTION: 650000, // ¥650,000 with e-filing and proper bookkeeping
  BLUE_FORM_55_DEDUCTION: 550000, // ¥550,000 with proper bookkeeping only
  BLUE_FORM_10_DEDUCTION: 100000, // ¥100,000 for simple bookkeeping

  // White form has no special deduction (白色申告)
  WHITE_FORM_DEDUCTION: 0,

  // Typical business expense ratios by profession (for estimation)
  // Users should track actual expenses, but these are helpful defaults
  EXPENSE_RATIOS: {
    IT_ENGINEER: 0.15, // 15% - mostly equipment, software, internet
    WRITER: 0.20, // 20% - research materials, software, workspace
    DESIGNER: 0.20, // 20% - software, equipment, supplies
    CONSULTANT: 0.25, // 25% - travel, meetings, workspace
    DEFAULT: 0.20, // 20% default estimate
  },
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
  {
    min: 1625001,
    max: 1800000,
    formula: (income: number) => income * 0.4 - 100000,
  },
  {
    min: 1800001,
    max: 3600000,
    formula: (income: number) => income * 0.3 + 80000,
  },
  {
    min: 3600001,
    max: 6600000,
    formula: (income: number) => income * 0.2 + 440000,
  },
  {
    min: 6600001,
    max: 8500000,
    formula: (income: number) => income * 0.1 + 1100000,
  },
  { min: 8500001, max: Infinity, formula: (income: number) => 1950000 }, // Maximum deduction
];
