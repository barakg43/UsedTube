import { useVerifyMutation } from "@/redux/api/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { finishInitialLoad, setAuth } from "@/redux/slices/authSlice";
import { useEffect } from "react";

export function useVerifyToken() {
  const dispatch = useAppDispatch();
  const [verify] = useVerifyMutation();

  useEffect(() => {
    verify(undefined)
      .unwrap()
      .then(() => {
        dispatch(setAuth());
      })
      .finally(() => {
        dispatch(finishInitialLoad());
      });
  }, []);
}
