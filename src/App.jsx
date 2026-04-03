import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Admin from './components/admin/Admin'
import Employees from './components/admin/Employees'
import Projects from './components/admin/Projects'
import AddEmployee from './components/admin/AddEmployee'
import AddProject from './components/admin/AddProject'
import Roles from './components/admin/Roles'
import PermissionGuard from './components/PermissionGuard'
import Notifications from './components/admin/Notifications'


const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />

      <Route path='/home' element={<Dashboard />}>
        <Route index element={<Admin />} />
        <Route path='employee' element={
          <PermissionGuard permission="view_employees">
            <Employees />
          </PermissionGuard>} />

        <Route path='role' element={
          <PermissionGuard permission="view_roles">
            <Roles/>
          </PermissionGuard>} />

        <Route path='project' element={
          <PermissionGuard permission="view_projects">
            <Projects />
            </PermissionGuard>} />

        <Route path='notifications' element={
          <Notifications/>
        }/>



        <Route path='employee/addemployee' element={
          <PermissionGuard permission="add_employee">
            <AddEmployee/>
            </PermissionGuard>}/>

        <Route path='project/addproject' element={
          <PermissionGuard permission="add_project">
             <AddProject/>
          </PermissionGuard>}/>
        

      </Route>

      {/* <Route path='/' element={<AddEmployee/>}/> */}
    </Routes>
  )
}

export default App
