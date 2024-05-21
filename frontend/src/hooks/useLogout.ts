import { useLogoutMutation } from "@/redux/api/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { logout as setLogout } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";

export function useLogout() {
  const [logoutApi, { isLoading }] = useLogoutMutation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const logout = () => {
    logoutApi(undefined)
      .unwrap()
      .then(() => {
        dispatch(setLogout());
        router.push("/login");
      });
  };

  return {
    logout,
    isLoading,
  };
}
