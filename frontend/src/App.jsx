import { Flex } from '@chakra-ui/react'

import AddTask from './components/AddTask'
import TodoList from './components/TodoList'
import SharedLayout from './pages/SharedLayout'
import Login from './components/Login'
import Register from './components/Register'
import UpdatePassword from './components/UpdatePassword'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, RequireAuth } from 'react-auth-kit'
import { refreshApi } from './utils'

const App = () => {
  return (
    <AuthProvider
      authType={'localstorage'}
      authName={'_auth'}
      refresh={refreshApi}
      cookieDomain={window.location.hostname}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SharedLayout />}>
            <Route index element={<TodoList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/updatePassword"
              element={
                <RequireAuth loginPath={'/login'}>
                  <UpdatePassword />
                </RequireAuth>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
