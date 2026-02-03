interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  register: any;
  error?: string;
}

export default function FormInput({
  label,
  name,
  type = "text",
  register,
  error,
}: FormInputProps) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">{label}</label>

      <input
        type={type}
        {...register(name)}
        aria-invalid={!!error}
        className={`w-full border p-2 rounded ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
