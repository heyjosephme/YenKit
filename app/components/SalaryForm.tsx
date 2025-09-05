import { Form } from "react-router";
import { PREFECTURES } from "~/lib/constants";

interface SalaryFormProps {
  onCalculate: (data: {
    annualGrossSalary: number;
    age: number;
    prefecture: string;
    dependents: number;
    employmentType: 'regular' | 'contract' | 'part-time';
    hasEmployerWithholding: boolean;
  }) => void;
}

export function SalaryForm({ onCalculate }: SalaryFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const data = {
      annualGrossSalary: Number(formData.get('annualGrossSalary')),
      age: Number(formData.get('age')),
      prefecture: String(formData.get('prefecture')),
      dependents: Number(formData.get('dependents')),
      employmentType: formData.get('employmentType') as 'regular' | 'contract' | 'part-time',
      hasEmployerWithholding: formData.get('hasEmployerWithholding') === 'on',
    };
    
    onCalculate(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Annual Gross Salary */}
        <div>
          <label htmlFor="annualGrossSalary" className="block text-sm font-medium text-gray-700 mb-2">
            Annual Gross Salary (万円)
          </label>
          <input
            type="number"
            name="annualGrossSalary"
            id="annualGrossSalary"
            min="300"
            max="10000"
            step="10"
            defaultValue="600"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="600 (for ¥6,000,000)"
          />
          <p className="mt-1 text-xs text-gray-500">Enter in 万円 (e.g., 600 = ¥6,000,000)</p>
        </div>

        {/* Age */}
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
            Age
          </label>
          <input
            type="number"
            name="age"
            id="age"
            min="18"
            max="100"
            defaultValue="30"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">Affects nursing care insurance (40+)</p>
        </div>

        {/* Prefecture */}
        <div>
          <label htmlFor="prefecture" className="block text-sm font-medium text-gray-700 mb-2">
            Prefecture
          </label>
          <select
            name="prefecture"
            id="prefecture"
            defaultValue="Tokyo"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {PREFECTURES.map((pref) => (
              <option key={pref.name} value={pref.name}>
                {pref.name} ({(pref.healthInsuranceRate * 100).toFixed(2)}%)
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">Health insurance rate varies by prefecture</p>
        </div>

        {/* Dependents */}
        <div>
          <label htmlFor="dependents" className="block text-sm font-medium text-gray-700 mb-2">
            Dependents
          </label>
          <input
            type="number"
            name="dependents"
            id="dependents"
            min="0"
            max="10"
            defaultValue="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">For future tax deduction calculations</p>
        </div>

        {/* Employment Type */}
        <div>
          <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-2">
            Employment Type
          </label>
          <select
            name="employmentType"
            id="employmentType"
            defaultValue="regular"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="regular">Regular Employee (正社員)</option>
            <option value="contract">Contract Employee (契約社員)</option>
            <option value="part-time">Part-time (パート)</option>
          </select>
        </div>

        {/* Employer Withholding */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="hasEmployerWithholding"
            id="hasEmployerWithholding"
            defaultChecked
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="hasEmployerWithholding" className="text-sm text-gray-700">
            Employer handles tax withholding (源泉徴収)
          </label>
        </div>
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
        >
          Calculate Take-Home Pay 💰
        </button>
      </div>
    </form>
  );
}