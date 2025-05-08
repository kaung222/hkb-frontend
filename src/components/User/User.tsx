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
import { useGetUser } from "@/api/user/get-users";
import { useDeleteUser } from "@/api/user/delete-user";
import { useUpdateUser } from "@/api/user/update-user";
import { useGerBraches } from "@/api/branch/branch.query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const Users = () => {
  const { openDialog } = useDialogStore();
  const { data: users, isLoading, isError, error } = useGetUser();
  const { data: shops } = useGerBraches();
  const [dialogKey, setDialogKey] = useState("");
  const [role, setRole] = useState("all");
  const [branch, setBranch] = useState("all");
  const form = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const filterUsers = () => {
    if (role === "all" && branch === "all") {
      return users;
    }
    if (role === "all" && branch !== "all") {
      return users.filter((user) => user.branchId === parseInt(branch));
    }
    if (role !== "all" && branch === "all") {
      return users.filter((user) => user.role === role);
    }
    if (role !== "all" && branch !== "all") {
      return users.filter(
        (user) => user.role === role && user.branchId === parseInt(branch)
      );
    }
  };

  const onSubmit = async (data: UserFormData) => {
    console.log(data);
  };
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: updateUser } = useUpdateUser();
  const handleEdit = (user: User) => {
    // setSelectedUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      // branchId: user.branchId,
      role: user.role,
      phone: user.phone,
      password: user.password,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      // delete user
      deleteUser(id);
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
      renderCell: (user: User) =>
        shops.find((shop) => shop.id === user.branchId)?.name,
    },
    {
      label: "Role",
      renderCell: (user: User) => user?.role,
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

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setDialogKey(dialogKeys.addNewUser);
            openDialog(dialogKeys.addNewUser);
            form.reset();
          }}
        >
          <PlusCircleIcon />
          Add new user
        </Button>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-[180px] rounded-lg border-gray-300 shadow-sm">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
            <SelectItem value="technician">Technicians</SelectItem>
            <SelectItem value="reception">Receptions</SelectItem>
          </SelectContent>
        </Select>

        <Select value={branch} onValueChange={setBranch}>
          <SelectTrigger className="w-[180px] rounded-lg border-gray-300 shadow-sm">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {shops.map((shop) => {
              return (
                <SelectItem key={shop.id} value={shop.id.toString()}>
                  {shop.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p>Error: {error.message}</p>
        ) : users && users.length > 0 ? (
          <VirtualizedTable
            data={filterUsers()}
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
