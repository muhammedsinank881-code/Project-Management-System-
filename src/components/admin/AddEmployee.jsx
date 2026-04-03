import React, { useState } from "react";
import { useAuth } from "../../context/AouthContext";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../context/RoleContext";



const AddEmployee = () => {

  const { addUser, users } = useAuth();
  const { roles } = useRole();

  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  //  Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    addUser(form);

    // reset form
    setForm({
      name: "",
      email: "",
      password: "",
      role: "employee",
    });

    alert("Employee added ✅");
  };

  console.log(users);


  return (
    <div className="p-6 flex justify-center">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-100 relative">

        <button
          onClick={() => navigate("/home/employee")}
          className="absolute top-4 right-4  text-sm text-gray-500 hover:text-black"
        >
          X Close
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          Add Employee
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
            required
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />

          {/* ROLE DROPDOWN */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
           {roles.map((role)=>(
            <option value={role.name}
            key={role.id}>{role.name} </option>
           ))}
          </select>

          {/* SUBMIT */}
          <button
            type="submit"
            className="bg-black text-white py-2 rounded hover:scale-105 transition"
          >
            Add Employee
          </button>

        </form>
      </div>

    </div>
  );
};

export default AddEmployee;