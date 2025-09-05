import type { SalaryBreakdown } from "~/lib/schemas";

interface ResultsDisplayProps {
  results: SalaryBreakdown;
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const formatCurrency = (amount: number) => `¥${amount.toLocaleString()}`;

  return (
    <div className="space-y-6">
      {/* Main Result */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Monthly Take-Home Pay</h3>
        <p className="text-4xl font-bold text-green-600">{formatCurrency(results.netMonthly)}</p>
        <p className="text-sm text-gray-600 mt-2">
          From annual salary of {formatCurrency(results.grossAnnual)}
        </p>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Income & Deductions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Income & Deductions</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Gross Annual Salary:</span>
              <span className="font-medium">{formatCurrency(results.grossAnnual)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Employment Income Deduction:</span>
              <span>-{formatCurrency(results.employmentIncomeDeduction)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Taxable Income:</span>
              <span className="font-medium">{formatCurrency(results.taxableIncome)}</span>
            </div>
          </div>
        </div>

        {/* Tax Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">National Taxes</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Income Tax:</span>
              <span className="text-red-600">{formatCurrency(results.taxation.incomeTax)}</span>
            </div>
            <div className="flex justify-between">
              <span>Reconstruction Surtax (2.1%):</span>
              <span className="text-red-600">{formatCurrency(results.taxation.reconstructionSurtax)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Total National Tax:</span>
              <span className="font-medium text-red-600">{formatCurrency(results.taxation.totalNationalTax)}</span>
            </div>
          </div>
        </div>

        {/* Social Insurance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Social Insurance</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Health Insurance:</span>
              <span className="text-orange-600">{formatCurrency(results.socialInsurance.healthInsurance)}</span>
            </div>
            {results.socialInsurance.nursingCareInsurance > 0 && (
              <div className="flex justify-between">
                <span>Nursing Care Insurance:</span>
                <span className="text-orange-600">{formatCurrency(results.socialInsurance.nursingCareInsurance)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Pension Insurance:</span>
              <span className="text-orange-600">{formatCurrency(results.socialInsurance.pensionInsurance)}</span>
            </div>
            <div className="flex justify-between">
              <span>Employment Insurance:</span>
              <span className="text-orange-600">{formatCurrency(results.socialInsurance.employmentInsurance)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Total Social Insurance:</span>
              <span className="font-medium text-orange-600">{formatCurrency(results.socialInsurance.totalSocialInsurance)}</span>
            </div>
          </div>
        </div>

        {/* Resident Tax */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-semibent text-gray-900 mb-4">Resident Tax (住民税)</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Prefectural Tax (~4%):</span>
              <span className="text-purple-600">{formatCurrency(results.residentTax.prefecturalTax)}</span>
            </div>
            <div className="flex justify-between">
              <span>Municipal Tax (~6%):</span>
              <span className="text-purple-600">{formatCurrency(results.residentTax.municipalTax)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Total Resident Tax:</span>
              <span className="font-medium text-purple-600">{formatCurrency(results.residentTax.totalResidentTax)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              *Paid the following year based on this year's income
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Annual Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Gross Annual:</span>
            <p className="font-medium text-lg">{formatCurrency(results.grossAnnual)}</p>
          </div>
          <div>
            <span className="text-gray-600">Total Deductions:</span>
            <p className="font-medium text-lg text-red-600">{formatCurrency(results.totalDeductions)}</p>
          </div>
          <div>
            <span className="text-gray-600">Net Annual:</span>
            <p className="font-medium text-lg text-green-600">{formatCurrency(results.netAnnual)}</p>
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