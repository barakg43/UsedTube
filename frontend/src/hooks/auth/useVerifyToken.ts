import { useVerifyMutation } from "@/redux/api/authApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { finishInitialLoad, logout, setAuth } from "@/redux/slices/authSlice";
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
      })
      .catch(() => {
        dispatch(logout());
      });
  }, []);
}
