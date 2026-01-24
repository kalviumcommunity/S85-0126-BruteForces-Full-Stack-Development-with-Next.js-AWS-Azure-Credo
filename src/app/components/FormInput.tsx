import { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface FormInputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  type?: string;
  register: UseFormRegister<T>;
  error?: string;
}

export default function FormInput<T extends FieldValues>({
  label,
  name,
  type = "text",
  register,
  error,
}: FormInputProps<T>) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        type={type}
        {...register(name)}
        className={`border p-2 rounded-md focus:outline-none focus:ring-2 transition-all ${
          error ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
        }`}
        aria-invalid={!!error}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}