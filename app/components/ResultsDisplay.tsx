import { useState } from "react";
import { Toggle } from "~/components/ui/toggle";
import type { SalaryBreakdown } from "~/lib/schemas";

interface ResultsDisplayProps {
  results: SalaryBreakdown;
  title?: string;
  isFreelancer?: boolean;
}

export function ResultsDisplay({ results, title, isFreelancer }: ResultsDisplayProps) {
  const [isYearly, setIsYearly] = useState(false);
  
  const formatCurrency = (amount: number) => `¥${amount.toLocaleString()}`;
  
  const getAmount = (annual: number, monthly: number) => 
    isYearly ? annual : monthly;
  
  const getPeriodText = () => isYearly ? "Annual" : "Monthly";

  return (
    <div className="space-y-6">
      {/* Period Toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={`text-sm font-medium ${!isYearly ? 'text-blue-600' : 'text-gray-500'}`}>
          Monthly
        </span>
        <Toggle 
          pressed={isYearly} 
          onPressedChange={setIsYearly}
          aria-label="Toggle between monthly and yearly view"
          className="data-[state=on]:bg-blue-600"
        />
        <span className={`text-sm font-medium ${isYearly ? 'text-blue-600' : 'text-gray-500'}`}>
          Yearly
        </span>
      </div>

      {/* Main Result */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {title ? `${title} - ` : ""}{getPeriodText()} Take-Home Pay
        </h3>
        <p className="text-4xl font-bold text-green-600">
          {formatCurrency(getAmount(results.netAnnual, results.netMonthly))}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          From {getPeriodText().toLowerCase()} salary of {formatCurrency(getAmount(results.grossAnnual, results.grossMonthly))}
        </p>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Income & Deductions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Income & Deductions</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Gross {getPeriodText()} Salary:</span>
              <span className="font-medium">{formatCurrency(getAmount(results.grossAnnual, results.grossMonthly))}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Employment Income Deduction:</span>
              <span>-{formatCurrency(getAmount(results.employmentIncomeDeduction, Math.floor(results.employmentIncomeDeduction / 12)))}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Taxable Income:</span>
              <span className="font-medium">{formatCurrency(getAmount(results.taxableIncome, Math.floor(results.taxableIncome / 12)))}</span>
            </div>
          </div>
        </div>

        {/* Tax Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">National Taxes</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Income Tax:</span>
              <span className="text-red-600">{formatCurrency(getAmount(results.taxation.incomeTax, Math.floor(results.taxation.incomeTax / 12)))}</span>
            </div>
            <div className="flex justify-between">
              <span>Reconstruction Surtax (2.1%):</span>
              <span className="text-red-600">{formatCurrency(getAmount(results.taxation.reconstructionSurtax, Math.floor(results.taxation.reconstructionSurtax / 12)))}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Total National Tax:</span>
              <span className="font-medium text-red-600">{formatCurrency(getAmount(results.taxation.totalNationalTax, Math.floor(results.taxation.totalNationalTax / 12)))}</span>
            </div>
          </div>
        </div>

        {/* Social Insurance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {isFreelancer ? "National Insurance" : "Social Insurance"}
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>{isFreelancer ? "National Health Insurance:" : "Health Insurance:"}</span>
              <span className="text-orange-600">{formatCurrency(getAmount(results.socialInsurance.healthInsurance, Math.floor(results.socialInsurance.healthInsurance / 12)))}</span>
            </div>
            {results.socialInsurance.nursingCareInsurance > 0 && (
              <div className="flex justify-between">
                <span>Nursing Care Insurance:</span>
                <span className="text-orange-600">{formatCurrency(getAmount(results.socialInsurance.nursingCareInsurance, Math.floor(results.socialInsurance.nursingCareInsurance / 12)))}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>{isFreelancer ? "National Pension:" : "Pension Insurance:"}</span>
              <span className="text-orange-600">{formatCurrency(getAmount(results.socialInsurance.pensionInsurance, Math.floor(results.socialInsurance.pensionInsurance / 12)))}</span>
            </div>
            {!isFreelancer && (
              <div className="flex justify-between">
                <span>Employment Insurance:</span>
                <span className="text-orange-600">{formatCurrency(getAmount(results.socialInsurance.employmentInsurance, Math.floor(results.socialInsurance.employmentInsurance / 12)))}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Total {isFreelancer ? "National" : "Social"} Insurance:</span>
              <span className="font-medium text-orange-600">{formatCurrency(getAmount(results.socialInsurance.totalSocialInsurance, Math.floor(results.socialInsurance.totalSocialInsurance / 12)))}</span>
            </div>
            {isFreelancer && (
              <p className="text-xs text-gray-500 mt-2">
                *National pension: Fixed ¥16,980/month regardless of income
              </p>
            )}
          </div>
        </div>

        {/* Resident Tax */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Resident Tax (住民税)</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Prefectural Tax (~4%):</span>
              <span className="text-purple-600">{formatCurrency(getAmount(results.residentTax.prefecturalTax, Math.floor(results.residentTax.prefecturalTax / 12)))}</span>
            </div>
            <div className="flex justify-between">
              <span>Municipal Tax (~6%):</span>
              <span className="text-purple-600">{formatCurrency(getAmount(results.residentTax.municipalTax, Math.floor(results.residentTax.municipalTax / 12)))}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Total Resident Tax:</span>
              <span className="font-medium text-purple-600">{formatCurrency(getAmount(results.residentTax.totalResidentTax, Math.floor(results.residentTax.totalResidentTax / 12)))}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              *Paid the following year based on this year's income
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">{getPeriodText()} Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Gross {getPeriodText()}:</span>
            <p className="font-medium text-lg">{formatCurrency(getAmount(results.grossAnnual, results.grossMonthly))}</p>
          </div>
          <div>
            <span className="text-gray-600">Total Deductions:</span>
            <p className="font-medium text-lg text-red-600">{formatCurrency(getAmount(results.totalDeductions, Math.floor(results.totalDeductions / 12)))}</p>
          </div>
          <div>
            <span className="text-gray-600">Net {getPeriodText()}:</span>
            <p className="font-medium text-lg text-green-600">{formatCurrency(getAmount(results.netAnnual, results.netMonthly))}</p>
          </div>
          <div>
            <span className="text-gray-600">Effective Tax Rate:</span>
            <p className="font-medium text-lg">
              {((results.totalDeductions / results.grossAnnual) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}