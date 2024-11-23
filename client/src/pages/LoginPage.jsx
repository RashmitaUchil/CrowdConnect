import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

// zod and form imports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// redux imports
import { useDispatch, useSelector } from "react-redux";
import { useLoginUserMutation } from "../features/apiSlice";
import { setUser } from "../features/userSlice";

// shadcn imports
import { useToast } from "@/hooks/use-toast";

// Color palette import
import colors from "../components/ui/colors";

function LoginPage() {
  // redux hooks
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  // zod schema definition
  const formSchema = z.object({
    email: z.string().email({ message: "Invalid email format" }).trim(),
    password: z
      .string({ required_error: "Password is required" })
      .trim()
      .refine((val) => val !== "", { message: "Password is required" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      const responseData = await loginUser(data).unwrap();
      toast({
        description: responseData.serverMsg,
      });
      dispatch(setUser(responseData.user));
      reset(); // Reset the form after successful login
      navigate("/");
    } catch (error) {
      console.error("Error submitting form", error);
      toast({
        variant: "destructive",
        description: error.data?.serverMsg || "An error occurred. Please try again.",
      });
    }
  };

  if (user) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="flex flex-grow" style={{ backgroundColor: colors.background }}>
      <div className="m-auto flex flex-col justify-center md:w-1/2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="my-4 flex flex-col rounded-md border-2 border-solid bg-white p-6 shadow-xl"
        >
          <h2
            className="m-3 text-center text-2xl font-bold"
            style={{ color: colors.primary }}
          >
            Welcome Back to CrowdConnect
          </h2>
          <label htmlFor="email" className="my-2">
            <p style={{ color: colors.textSecondary }}>Email</p>
            <input
              {...register("email")}
              type="email"
              placeholder="nivin@gmail.com"
              className="form-input w-full rounded-md border-none bg-gray-200"
              name="email"
            />
          </label>
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}

          <label htmlFor="password" className="my-2">
            <p style={{ color: colors.textSecondary }}>Password</p>
            <input
              {...register("password")}
              type="password"
              className="form-input w-full rounded-md border-none bg-gray-200"
              name="password"
              placeholder="1234"
            />
          </label>
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}

          <button
            type="submit"
            className="my-6 rounded-md py-2 text-lg font-bold"
            style={{
              backgroundColor: colors.primary,
              color: colors.buttonText,
            }}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <div className="my-1 text-center text-lg md:w-full">
            <p>
              Dont have an account?{" "}
              <Link to={"/register"} style={{ fontWeight: "bold", color: colors.primary }}>
                Create new
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
