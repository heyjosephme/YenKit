import { useState } from "react";
import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";
import { SalaryForm } from "~/components/SalaryForm";
import { ResultsDisplay } from "~/components/ResultsDisplay";
import { calculateSalary } from "~/lib/calculations";
import { logger } from "~/lib/logger";
import type { SalaryInput, SalaryBreakdown } from "~/lib/schemas";

type SalaryComparison = {
  id: string;
  title: string;
  input: SalaryInput;
  results: SalaryBreakdown;
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "YenKit - Japanese Finance Tools" },
    { name: "description", content: "Calculate your Japanese salary take-home pay and more financial tools" },
  ];
}

export default function Home() {
  const [salaries, setSalaries] = useState<SalaryComparison[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showingForm, setShowingForm] = useState(true);

  const handleCalculation = (formData: SalaryInput) => {
    try {
      setError(null);
      // Convert 万円 to yen
      const salaryInYen = formData.annualGrossSalary * 10000;
      
      const input: SalaryInput = {
        ...formData,
        annualGrossSalary: salaryInYen,
      };
      
      logger.info("Calculating salary with input:", input);
      const calculationResults = calculateSalary(input);
      
      // Create a new comparison entry
      const newSalary: SalaryComparison = {
        id: Date.now().toString(),
        title: generateSalaryTitle(input),
        input,
        results: calculationResults,
      };
      
      setSalaries(prev => [...prev, newSalary]);
      setShowingForm(false);
    } catch (err) {
      logger.error("Calculation error:", err);
      setError(err instanceof Error ? err.message : "Calculation failed");
    }
  };

  const generateSalaryTitle = (input: SalaryInput): string => {
    const salary = (input.annualGrossSalary / 10000).toLocaleString();
    const type = input.employmentType === 'regular' ? 'Regular' : 
                 input.employmentType === 'contract' ? 'Contract' : 
                 input.employmentType === 'part-time' ? 'Part-time' : 'Freelance';
    return `${type} (¥${salary}万)`;
  };

  const removeSalary = (id: string) => {
    setSalaries(prev => prev.filter(s => s.id !== id));
  };

  const addNewComparison = () => {
    setShowingForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            YenKit <span className="text-2xl">🎯</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Japanese Finance Tools - Calculate your salary, taxes, and take-home pay
          </p>
        </header>

        <div className="max-w-6xl mx-auto">
          {/* Show form when needed */}
          {showingForm && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  {salaries.length === 0 ? "Salary Calculator" : "Add Another Salary for Comparison"}
                </h2>
                {salaries.length > 0 && (
                  <Button variant="outline" onClick={() => setShowingForm(false)}>
                    Cancel
                  </Button>
                )}
              </div>
              <p className="text-gray-600 text-center mb-8">
                Enter your annual gross salary to calculate your monthly take-home pay after taxes and insurance
              </p>
              
              <SalaryForm onCalculate={handleCalculation} />
              
              {error && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">Error: {error}</p>
                </div>
              )}
            </div>
          )}

          {/* Show results and comparison */}
          {salaries.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  {salaries.length === 1 ? "Your Salary Breakdown" : `Salary Comparison (${salaries.length})`}
                </h2>
                {!showingForm && (
                  <Button onClick={addNewComparison} className="gap-2">
                    + Add Salary for Comparison
                  </Button>
                )}
              </div>

              <div className="space-y-8">
                {salaries.map((salary) => (
                  <div key={salary.id} className="bg-white rounded-2xl shadow-xl p-8 relative">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900">{salary.title}</h3>
                      {salaries.length > 1 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => removeSalary(salary.id)}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <ResultsDisplay 
                      results={salary.results} 
                      title={salary.title}
                      isFreelancer={salary.input.employmentType === 'freelance'} 
                    />
                  </div>
                ))}
              </div>

              {/* Quick comparison table for multiple salaries */}
              {salaries.length > 1 && (
                <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Comparison</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium text-gray-900">Option</th>
                          <th className="text-right p-3 font-medium text-gray-900">Gross Annual</th>
                          <th className="text-right p-3 font-medium text-gray-900">Net Annual</th>
                          <th className="text-right p-3 font-medium text-gray-900">Net Monthly</th>
                          <th className="text-right p-3 font-medium text-gray-900">Tax Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salaries.map((salary) => (
                          <tr key={salary.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{salary.title}</td>
                            <td className="p-3 text-right">¥{salary.results.grossAnnual.toLocaleString()}</td>
                            <td className="p-3 text-right text-green-600 font-medium">¥{salary.results.netAnnual.toLocaleString()}</td>
                            <td className="p-3 text-right text-green-600 font-medium">¥{salary.results.netMonthly.toLocaleString()}</td>
                            <td className="p-3 text-right">{((salary.results.totalDeductions / salary.results.grossAnnual) * 100).toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Features section - only show when no calculations */}
          {salaries.length === 0 && !showingForm && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="font-semibold text-gray-900 mb-2">Accurate Calculations</h3>
                <p className="text-sm text-gray-600">Based on 2024 Japanese tax rates and social insurance</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold text-gray-900 mb-2">Compare Multiple Salaries</h3>
                <p className="text-sm text-gray-600">Add multiple salary options and compare them side by side</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-3xl mb-3">🔧</div>
                <h3 className="font-semibold text-gray-900 mb-2">More Tools Coming</h3>
                <p className="text-sm text-gray-600">Mortgage calculators, NISA, iDeCo, and other Japan-specific tools</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
