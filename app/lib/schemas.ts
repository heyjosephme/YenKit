import { z } from "zod";

// Input validation schemas
export const SalaryInputSchema = z.object({
  annualGrossSalary: z.number().min(1000000).max(100000000), // 1M to 100M yen
  age: z.number().min(18).max(100),
  prefecture: z.string().min(1),
  dependents: z.number().min(0).max(10),
  employmentType: z.enum(["regular", "contract", "part-time", "freelance"]),
  hasEmployerWithholding: z.boolean().default(true),
  // Freelance-specific fields
  freelancePaymentType: z.enum(["hourly", "annual"]).optional(),
  hourlyRate: z.number().min(1000).max(50000).optional(), // ¥1,000 to ¥50,000 per hour
  hoursPerWeek: z.number().min(1).max(80).optional(), // 1-80 hours per week
  weeksPerYear: z.number().min(1).max(52).optional(), // 1-52 weeks per year

  // Freelance tax options
  blueFormFiling: z.enum(["none", "blue_65", "blue_55", "blue_10"]).optional(), // Blue form filing type
  businessExpenseRate: z.number().min(0).max(0.8).optional(), // 0-80% of gross income
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

  // Freelance-specific fields (optional)
  businessExpenses: z.number().optional(),
  blueFormDeduction: z.number().optional(),
  businessIncome: z.number().optional(), // Gross - expenses
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
