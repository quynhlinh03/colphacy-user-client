import { REQUEST_USER_PROFILE } from "./../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
import useAuthStore from "../store/AuthStore";
import { Account } from "../types/Account";

function useUserProfile() {
  const { update } = useAuthStore();
  const updateUserProfile = (userProfile) => {
    update(userProfile);
  };
  const fetchUserProfile = useQuery({
    queryKey: ["employee_profile"],
    queryFn: () => axios.get(REQUEST_USER_PROFILE),
    enabled: false,
  });
  const handleUpdateProfile = useMutation({
    mutationKey: ["employee_updtae_profile"],
    mutationFn: (data: Account) => {
      return axios.put(REQUEST_USER_PROFILE, data);
    },
  });
  const onSubmitProfileForm = (
    data: Account,
    onSuccess: () => void,
    onError: (error: object) => void
  ) => {
    handleUpdateProfile.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  return {
    fetchUserProfile,
    handleUpdateProfile,
    onSubmitProfileForm,
    updateUserProfile
  };
}
export default useUserProfile;
