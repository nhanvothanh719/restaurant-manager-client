import RegisterForm from "@/app/(auth)/register/register-form";

export default function RegisterPage() {
  return (
    <div>
      <h3 className="text-xl font-semibold text-center">Register</h3>
      <div className="flex justify-center">
        <RegisterForm />
      </div>
    </div>
  );
}
