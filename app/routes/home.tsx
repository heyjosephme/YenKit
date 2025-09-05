import { useState } from "react";
import type { Route } from "./+types/home";
import { SalaryForm } from "~/components/SalaryForm";
import { ResultsDisplay } from "~/components/ResultsDisplay";
import { calculateSalary } from "~/lib/calculations";
import { logger } from "~/lib/logger";
import type { SalaryInput, SalaryBreakdown } from "~/lib/schemas";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "YenKit - Japanese Finance Tools" },
    { name: "description", content: "Calculate your Japanese salary take-home pay and more financial tools" },
  ];
}

export default function Home() {
  const [results, setResults] = useState<SalaryBreakdown | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      setResults(calculationResults);
    } catch (err) {
      logger.error("Calculation error:", err);
      setError(err instanceof Error ? err.message : "Calculation failed");
    }
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
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Salary Calculator
            </h2>
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

          {results && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Your Salary Breakdown
              </h2>
              <ResultsDisplay results={results} />
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-semibold text-gray-900 mb-2">Accurate Calculations</h3>
              <p className="text-sm text-gray-600">Based on 2024 Japanese tax rates and social insurance</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-900 mb-2">Detailed Breakdown</h3>
              <p className="text-sm text-gray-600">See exactly where your money goes - taxes, insurance, and more</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl mb-3">🔧</div>
              <h3 className="font-semibent text-gray-900 mb-2">More Tools Coming</h3>
              <p className="text-sm text-gray-600">Mortgage calculators, NISA, iDeCo, and other Japan-specific tools</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
