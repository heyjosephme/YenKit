import { z } from "zod";

// Input validation schemas
export const SalaryInputSchema = z.object({
  annualGrossSalary: z.number().min(1000000).max(100000000), // 1M to 100M yen
  age: z.number().min(18).max(100),
  prefecture: z.string().min(1),
  dependents: z.number().min(0).max(10),
  employmentType: z.enum(['regular', 'contract', 'part-time']),
  hasEmployerWithholding: z.boolean().default(true),
});

// Calculation result schemas
export const TaxCalculationSchema = z.object({
  taxableIncome: z.number(),
  incomeTax: z.number(),
  reconstructionSurtax: z.number(),
  totalNationalTax: z.number(),
});

export const SocialInsuranceSchema = z.object({
  healthInsurance: z.number(),
  nursingCareInsurance: z.number(),
  pensionInsurance: z.number(),
  employmentInsurance: z.number(),
  totalSocialInsurance: z.number(),
});

export const ResidentTaxSchema = z.object({
  prefecturalTax: z.number(),
  municipalTax: z.number(),
  totalResidentTax: z.number(),
});

export const SalaryBreakdownSchema = z.object({
  grossAnnual: z.number(),
  grossMonthly: z.number(),
  employmentIncomeDeduction: z.number(),
  taxableIncome: z.number(),
  
  taxation: TaxCalculationSchema,
  socialInsurance: SocialInsuranceSchema,
  residentTax: ResidentTaxSchema,
  
  totalDeductions: z.number(),
  netAnnual: z.number(),
  netMonthly: z.number(),
});

// Tax bracket schema
export const TaxBracketSchema = z.object({
  min: z.number(),
  max: z.number(),
  rate: z.number(),
});

// Prefecture schema
export const PrefectureSchema = z.object({
  name: z.string(),
  healthInsuranceRate: z.number(),
});

// Export types derived from schemas
export type SalaryInput = z.infer<typeof SalaryInputSchema>;
export type TaxCalculation = z.infer<typeof TaxCalculationSchema>;
export type SocialInsurance = z.infer<typeof SocialInsuranceSchema>;
export type ResidentTax = z.infer<typeof ResidentTaxSchema>;
export type SalaryBreakdown = z.infer<typeof SalaryBreakdownSchema>;
export type TaxBracket = z.infer<typeof TaxBracketSchema>;
export type Prefecture = z.infer<typeof PrefectureSchema>;