// Redux imports
import { useSelector, useDispatch } from "react-redux";
import {
  useUpdateProfileMutation
 
} from "../features/apiSlice";
import { setUser } from "../features/userSlice";

// zod and form imports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// shadcn imports
import { useToast } from "@/hooks/use-toast";

function EditProfile() {
  // redux hooks
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [updateProfile] = useUpdateProfileMutation();
  // zod schema definition
  const profileSchema = z.object({
    name: z
      .string()
      .min(3, { message: "Name must be atleast 3 characters long" })
      .max(20, { message: "Name cannot be longer than 20 characters" })
      .trim()
      .optional(),

    phoneNo: z.coerce
      .number()
      .gte(1000000000, { message: "Phone number should be 10 digits" })
      .lte(9999999999, { message: "Phone number should be 10 digits" })
      .optional(),

    age: z.coerce
      .number()
      .int()
      .positive()
      .gte(18, { message: "Age should be atleast 18" })
      .lte(130, { message: "Enter a valid number" })
      .optional(),
  });

  // react-hook-form initialization
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      phoneNo: user.phoneNo,
      age: user.age,
    },
  });

  // Image upload function
 

  const { toast } = useToast();

  // User details update function
  const handleUserDetailsUpdate = async (data) => {
    try {
      console.log(data);
      const responseData = await updateProfile(data).unwrap();
      console.log(responseData);
      dispatch(setUser(responseData.updatedDoc));
      toast({ description: responseData.serverMsg });
    } catch (error) {
      console.log("Error submitting form");
      console.error(error);
    }
  };

  return (
    <div className="flex-grow flex-col">
      <div className="m-auto rounded-lg p-6 shadow-lg md:w-1/2">
        

        {/* User details form */}
        <form onSubmit={handleSubmit(handleUserDetailsUpdate)}>
          <div id="textElements" className="my-8 w-full">
            <div className="my-6">
              <label htmlFor="">
                <p className="font-medium">Full Name</p>
                <input
                  {...register("name")}
                  type="text"
                  className="form-input w-full rounded-md border-none bg-gray-200 shadow-inner"
                />
              </label>
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="my-6">
              <label htmlFor="">
                <p className="font-medium">Email</p>
                <input
                  type="email"
                  placeholder={user.email}
                  disabled
                  className="w-full rounded-md border-none bg-gray-200 shadow-inner"
                />
              </label>
            </div>
            <div className="my-6">
              <label htmlFor="">
                <p className="font-medium">Age</p>
                <input
                  {...register("age")}
                  type="number"
                  className="w-full rounded-md border-none bg-gray-200 shadow-inner"
                />
              </label>
              {errors.age && (
                <p className="text-red-500">{errors.age.message}</p>
              )}
            </div>
            <div className="my-6">
              <label htmlFor="">
                <p className="font-medium">Phone Number</p>
                <input
                  {...register("phoneNo")}
                  type="number"
                  className="w-full rounded-md border-none bg-gray-200 shadow-inner"
                />
              </label>
              {errors.phoneNo && (
                <p className="text-red-500">{errors.phoneNo.message}</p>
              )}
            </div>
          </div>

          <div className="flex w-full">
            <button
              type="submit"
              className="mx-auto rounded-full bg-[#588157] px-10 py-2 text-xl font-bold text-[#f2e8cf] hover:shadow-lg"
            >
              Update
            </button>
          </div>
        </form>
        {/* Update profile section ends */}
      </div>
    </div>
  );
}

export default EditProfile;
