"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { UserFormData, UserSchema } from "./schema/UserSchema";
import { useDialogStore } from "@/stores/dialog/useDialogStore";
import { dialogKeys } from "@/constants/general.const";
import UserDialog from "./UserDialog";
import { PlusCircleIcon } from "lucide-react";
import VirtualizedTable from "../common/VirtualizedTable";
import { User } from "@/types/user";
import { checkRole } from "@/lib/utils";
import { useGetUser } from "@/api/user/get-users";

const Users = () => {
  const { openDialog } = useDialogStore();
  const { data: users, isLoading, isError, error } = useGetUser();
  const [user, setUser] = useState();
  const [dialogKey, setDialogKey] = useState("");
  const form = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const onSubmit = async (data: UserFormData) => {
    console.log(data);
  };

  const handleEdit = (user: User) => {
    // setSelectedUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      branchId: user.branch,
      role: user.role,
      phone: user.phone,
      password: user.password,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      // delete user
      console.log(id);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const columns = [
    {
      label: "Name",
      renderCell: (user: User) => user.name,
    },
    {
      label: "Email",
      renderCell: (user: User) => user.email,
    },
    {
      label: "Phone Number",
      renderCell: (user: User) => user.phone,
    },
    {
      label: "Branch",
      renderCell: (user: User) => user.branch,
    },
    {
      label: "Role",
      renderCell: (user: User) => user.role,
    },
    {
      label: "Actions",
      renderCell: (user: User) => (
        <div className="space-x-3">
          <Button
            variant="outline"
            onClick={() => {
              setDialogKey(dialogKeys.editUser);
              handleEdit(user);
              openDialog(dialogKeys.editUser);
            }}
          >
            Edit
          </Button>
          <Button variant="destructive" onClick={() => handleDelete(user.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto p-8">
      {/* User Form */}
      <Button
        variant="outline"
        onClick={() => {
          setDialogKey(dialogKeys.addNewUser);
          openDialog(dialogKeys.addNewUser);
        }}
      >
        <PlusCircleIcon />
        Add new user
      </Button>

      <div className="mt-5">
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p>Error: {error.message}</p>
        ) : users && users.length > 0 ? (
          <VirtualizedTable
            data={users}
            columns={columns}
            rowKey={(user) => user.id}
            onRowClick={(user) => console.log("Row clicked:", user)}
          />
        ) : (
          <p>No users available.</p>
        )}
      </div>

      <UserDialog form={form} dialogKey={dialogKey} />
    </div>
  );
};

export default Users;
