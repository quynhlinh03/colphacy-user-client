import { create } from 'zustand'

interface AuthStoreState {
  userProfile: object | null
  accessToken: string | null
  setLocalStorage: (accessToken: string, userProfile: object, expirationTime: string) => void
  login: (accessToken: string, userProfile: object, expirationTime: string) => void
  logout: () => void;
  update: (userProfile: any) => void; 
}

const useAuthStore = create<AuthStoreState>(set => ({

  userProfile: localStorage.getItem('userProfile')
    ? JSON.parse(localStorage.getItem('userProfile')!)
    : {},
  accessToken: localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : '',

  setLocalStorage: (accessToken, userProfile,expirationTime) => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile))
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem("expirationTime", expirationTime);
  },

  login: (accessToken, userProfile, expirationTime) => {
    set((state) => {
      state.setLocalStorage(accessToken, userProfile, expirationTime)
      return {
        accessToken,
        userProfile,
      }
    })
  },
  logout: () => {
    set(() => {
      localStorage.clear()
      return {
        accessToken: '',
        userProfile: {},
      }
    })
  },
  update: (userProfile) => {
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    set({ userProfile });
  },
}))

export default useAuthStore