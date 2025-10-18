import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { PREFECTURES } from "~/lib/constants";
import type { SalaryInput } from "~/lib/schemas";

const formSchema = z.object({
  annualGrossSalary: z.number().min(300).max(10000),
  age: z.number().min(18).max(100),
  prefecture: z.string().min(1),
  dependents: z.number().min(0).max(10),
  employmentType: z.enum(['regular', 'contract', 'part-time', 'freelance']),
  hasEmployerWithholding: z.boolean(),
  // Freelance-specific fields
  freelancePaymentType: z.enum(['hourly', 'annual']).optional(),
  hourlyRate: z.number().min(10).max(500).optional(), // In 100 yen units (e.g., 50 = ¥5,000)
  hoursPerWeek: z.number().min(1).max(80).optional(),
  weeksPerYear: z.number().min(1).max(52).optional(),
  blueFormFiling: z.enum(['none', 'blue_65', 'blue_55', 'blue_10']).optional(),
  businessExpenseRate: z.number().min(0).max(0.8).optional(),
});

interface SalaryFormProps {
  onCalculate: (data: SalaryInput) => void;
}

export function SalaryForm({ onCalculate }: SalaryFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      annualGrossSalary: 600,
      age: 30,
      prefecture: "Tokyo",
      dependents: 0,
      employmentType: "regular",
      hasEmployerWithholding: true,
      freelancePaymentType: "hourly",
      hourlyRate: 50, // ¥5,000/hour
      hoursPerWeek: 40,
      weeksPerYear: 48,
      blueFormFiling: "blue_65",
      businessExpenseRate: 0.2,
    },
  });

  const employmentType = form.watch("employmentType");
  const freelancePaymentType = form.watch("freelancePaymentType");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onCalculate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Annual Gross Salary */}
          <FormField
            control={form.control}
            name="annualGrossSalary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Gross Salary (万円)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="600"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Enter in 万円 (e.g., 600 = ¥6,000,000)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Age */}
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Affects nursing care insurance (40+)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Prefecture */}
          <FormField
            control={form.control}
            name="prefecture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prefecture</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select prefecture" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PREFECTURES.map((pref) => (
                      <SelectItem key={pref.name} value={pref.name}>
                        {pref.name} ({(pref.healthInsuranceRate * 100).toFixed(2)}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Health insurance rate varies by prefecture
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dependents */}
          <FormField
            control={form.control}
            name="dependents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dependents</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  For future tax deduction calculations
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Employment Type */}
          <FormField
            control={form.control}
            name="employmentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="regular">Regular Employee (正社員)</SelectItem>
                    <SelectItem value="contract">Contract Employee (契約社員)</SelectItem>
                    <SelectItem value="part-time">Part-time (パート)</SelectItem>
                    <SelectItem value="freelance">Freelance (フリーランス)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Freelance-specific fields */}
        {employmentType === "freelance" && (
          <>
            <div className="border-t pt-6 mt-2">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Freelance Payment Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Payment Type */}
                <FormField
                  control={form.control}
                  name="freelancePaymentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly Rate (時給)</SelectItem>
                          <SelectItem value="annual">Annual Estimate (年収)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose how you want to calculate your income
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {freelancePaymentType === "hourly" ? (
                  <>
                    {/* Hourly Rate */}
                    <FormField
                      control={form.control}
                      name="hourlyRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hourly Rate (100円単位)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="50"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter in 100円 units (e.g., 50 = ¥5,000/hour)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Hours Per Week */}
                    <FormField
                      control={form.control}
                      name="hoursPerWeek"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hours Per Week</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="40"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Average billable hours per week
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Weeks Per Year */}
                    <FormField
                      control={form.control}
                      name="weeksPerYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weeks Per Year</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="48"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Working weeks per year (52 - vacation weeks)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                ) : (
                  <div className="md:col-span-1">
                    <p className="text-sm text-gray-600">
                      Use the Annual Gross Salary field above to enter your estimated yearly income
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tax deductions section */}
            <div className="border-t pt-6 mt-2">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Tax Deductions (控除)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Blue Form Filing */}
                <FormField
                  control={form.control}
                  name="blueFormFiling"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Filing Type (確定申告)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">White Form (白色申告) - No deduction</SelectItem>
                          <SelectItem value="blue_10">Blue Form 10万 - ¥100,000 deduction</SelectItem>
                          <SelectItem value="blue_55">Blue Form 55万 - ¥550,000 deduction</SelectItem>
                          <SelectItem value="blue_65">Blue Form 65万 - ¥650,000 deduction</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Blue form requires proper bookkeeping (65万 needs e-filing)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Business Expense Rate */}
                <FormField
                  control={form.control}
                  name="businessExpenseRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Expense Rate (経費率)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.05"
                          min="0"
                          max="0.8"
                          placeholder="0.2"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Estimate: 0.2 = 20% of gross income as expenses
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Typical expense rates:</strong> IT Engineer 15%, Writer/Designer 20%, Consultant 25%
                </p>
              </div>
            </div>
          </>
        )}

        <div className="text-center">
          <Button type="submit" size="lg" className="px-8">
            Calculate Take-Home Pay 💰
          </Button>
        </div>
      </form>
    </Form>
  );
}