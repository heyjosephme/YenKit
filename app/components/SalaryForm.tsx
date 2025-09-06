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
  employmentType: z.enum(['regular', 'contract', 'part-time']),
  hasEmployerWithholding: z.boolean(),
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
    },
  });

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
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="text-center">
          <Button type="submit" size="lg" className="px-8">
            Calculate Take-Home Pay 💰
          </Button>
        </div>
      </form>
    </Form>
  );
}