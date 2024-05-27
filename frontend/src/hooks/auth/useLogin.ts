import { useToaster } from "@/app/(common)/useToaster";
import { useLoginMutation } from "@/redux/api/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setAuth } from "@/redux/slices/authSlice";
import { UserCredentials } from "@/types";
import { useRouter } from "next/navigation";

export default function useLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loginApi, { isLoading }] = useLoginMutation();

  //   const [formData, setFormData] = useState({
  //     username: "",
  //     password: "",
  //   });

  //   const { username, password } = formData;

  //   const onChange = (event: ChangeEvent<HTMLInputElement>) => {
  //     const { name, value } = event.target;

  //     setFormData({ ...formData, [name]: value });
  //   };
  const toaster = useToaster();

  const login = ({ username, password }: UserCredentials) => {
    loginApi({ username, password })
      .unwrap()
      .then(() => {
        dispatch(setAuth());
        toaster("Logged in successfully", "success");

        router.push("/drive/");
      })
      .catch(() => {
        toaster("Failed to log in", "error");
      });
  };

  return {
    login,
    isLoading,
  };
}
