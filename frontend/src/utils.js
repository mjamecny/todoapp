import axios from 'axios'
import { createRefresh } from 'react-auth-kit'

export const refreshApi = createRefresh({
  interval: 10, // Refreshs the token in every 10 minutes
  refreshApiCallback: async ({
    authToken,
    authTokenExpireAt,
    refreshToken,
    refreshTokenExpiresAt,
    authUserState,
  }) => {
    try {
      const res = await axios.post(
        `${
          import.meta.env.DEV
            ? 'http://localhost:5000'
            : 'https://vodhub-api.onrender.com'
        }/api/users/token`,
        { refreshToken },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      )
      return {
        isSuccess: true,
        newAuthToken: res.data.token,
      }
    } catch (error) {
      console.error(error)
      return {
        isSuccess: false,
      }
    }
  },
})
