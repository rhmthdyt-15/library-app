import { useEffect, useState } from "react";
import { User, UserCreateRequest } from "../../../../services/user/interface";

interface Props {
  initialData?: User;
  onSubmit: (data: UserCreateRequest) => void;
  onCancel: () => void;
}

const defaultForm: UserCreateRequest = {
  name: "",
  email: "",
  password: "",
  role: "admin",
  phone_number: "",
  address: "",
};

export const UserForm: React.FC<Props> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<UserCreateRequest>(defaultForm);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        password: "",
        role: initialData.role,
        phone_number: initialData.phone_number,
        address: initialData.address,
      });
    } else {
      setFormData(defaultForm);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formMode = initialData ? "edit" : "add";

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {formMode === "add" ? "Add New User" : "Edit User"}
        </h2>
        <button
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
        >
          Close
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Password", name: "password", type: "password" },
            { label: "Phone Number", name: "phone_number", type: "text" },
            { label: "Address", name: "address", type: "text" },
          ].map((field) => (
            <div className="space-y-2" key={field.name}>
              <label className="block text-sm font-medium">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={(formData as any)[field.name]}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                required={field.name !== "password" || formMode === "add"}
              />
            </div>
          ))}

          {/* Role */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              required
            >
              <option value="admin">Admin</option>
              <option value="member">Member</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {formMode === "add" ? "Create User" : "Update User"}
          </button>
        </div>
      </form>
    </div>
  );
};
