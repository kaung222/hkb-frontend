import React, { useState } from "react";
import { useGetItem } from "./hooks/Item.query";
import {
  useCreateItem,
  useDeleteItem,
  useUpdateItem,
} from "./hooks/item.mutation";
import { useForm } from "react-hook-form";
import { Item } from "@/types/inventory";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCurrentUser } from "@/api/user/current-user";

// Form validation schema
const itemFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  price: z.coerce
    .number()
    .min(0, { message: "Price must be a positive number" }),
  quantity: z.coerce
    .number()
    .min(0, { message: "Quantity must be a positive number" }),
  note: z.string().optional(),
  branchId: z.coerce.number(),
  code: z.string().optional(),
});

type ItemFormValues = z.infer<typeof itemFormSchema>;
type Props = {
  search: string;
};
const ItemTable = (props: Props) => {
  const { data: items, isLoading, error } = useGetItem();
  const { mutate: updateItem } = useUpdateItem();
  const { mutate: deleteItem } = useDeleteItem();
  const { mutate: saveItem } = useCreateItem();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // filter items by search
  const filteredItems = items?.filter((item) => {
    return (
      item.name.toLowerCase().includes(props.search.toLowerCase()) ||
      item.code?.toLowerCase().includes(props.search.toLowerCase())
    );
  });
  const { data: user } = useCurrentUser();
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: "",
      price: 0,
      quantity: 0,
      note: "",
      branchId: user?.branchId,
      code: "",
    },
  });

  const handleEdit = (item: Item) => {
    setSelectedItem(item);
    form.reset({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      note: item.note || "",
      branchId: item.branchId,
      code: item.code,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (item: Item) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedItem?.id) {
      deleteItem(selectedItem.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setSelectedItem(null);
        },
      });
    }
  };

  const onSubmit = (data: ItemFormValues) => {
    if (selectedItem?.id) {
      // Update existing item
      updateItem(
        {
          branchId: data.branchId,
          name: data.name,
          price: data.price,
          quantity: data.quantity,
          note: data.note,
          total: data.price * data.quantity,
          code: data.code,
          id: selectedItem.id,
        },
        {
          onSuccess: () => {
            setIsEditDialogOpen(false);
            setSelectedItem(null);
            form.reset();
          },
        }
      );
    } else {
      // Create new item
      saveItem(
        {
          branchId: data.branchId,
          name: data.name,
          price: data.price,
          quantity: data.quantity,
          note: data.note,
          total: data.price * data.quantity,
          code: data.code,
        },
        {
          onSuccess: () => {
            setIsEditDialogOpen(false);
            form.reset();
          },
        }
      );
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading items</div>;
  console.log(items);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inventory Items</h2>
        <Button
          onClick={() => {
            setSelectedItem(null);
            form.reset({
              name: "",
              price: 0,
              quantity: 0,
              note: "",
              code: "",
              branchId: user?.branchId,
            });
            setIsEditDialogOpen(true);
          }}
        >
          Add New Item
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Vr. Code</TableHead>
              <TableHead>Note</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems && filteredItems.length > 0 ? (
              filteredItems?.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.total}</TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.note}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No items found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className=" mt-5 p-5">
          <p>
            {" "}
            <b>Total Items:</b> {items?.length}
          </p>
          <p>
            <b>Total Value: </b>
            MMK {items?.reduce((acc, item) => acc + item.total, 0)}
          </p>
        </div>
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? "Edit Item" : "Add New Item"}
            </DialogTitle>
            <DialogDescription>
              {selectedItem
                ? "Make changes to the item here."
                : "Add a new inventory item."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Item name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vr. Code(optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="206154-2025-07-08"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional note" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <input type="hidden" {...form.register("branchId")} />
              <DialogFooter>
                <Button type="submit">
                  {selectedItem ? "Save Changes" : "Add Item"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedItem?.name}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemTable;
