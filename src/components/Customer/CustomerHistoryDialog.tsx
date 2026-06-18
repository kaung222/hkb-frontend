import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDialogStore } from "@/stores/dialog/useDialogStore";
import { dialogKeys } from "@/constants/general.const";
import { useGetCustomerServiceHistory } from "@/api/service/service.query";
import { Customer } from "@/types/customer";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface Props {
  customer: Customer | null;
}

const formatDate = (date?: string) => {
  if (!date) return "-";
  try {
    return format(new Date(date), "yyyy-MM-dd");
  } catch {
    return "-";
  }
};

const formatStatus = (status?: string) =>
  status ? status.replace(/_/g, " ") : "-";

export default function CustomerHistoryDialog({ customer }: Props) {
  const { isOpen, handleDialogChange } = useDialogStore();
  const {
    data: services,
    isLoading,
    isError,
    error,
  } = useGetCustomerServiceHistory(customer?.id);

  return (
    <Dialog
      open={isOpen(dialogKeys.customerHistory)}
      onOpenChange={(open) =>
        handleDialogChange(dialogKeys.customerHistory, open)
      }
    >
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            Service History{customer ? ` - ${customer.username}` : ""}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <p className="py-8 text-center text-muted-foreground">Loading...</p>
          ) : isError ? (
            <p className="py-8 text-center text-destructive">
              Error: {(error as Error)?.message}
            </p>
          ) : services && services.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Error</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <Link
                        to={`/service?date=${format(service.createdAt, "yyyy-MM-dd")}&query=${service.code}`}
                        className="text-primary underline"
                      >
                        {service.code || "-"}
                      </Link>
                    </TableCell>
                    <TableCell>{service.code || "-"}</TableCell>
                    <TableCell>
                      {[service.brand, service.model]
                        .filter(Boolean)
                        .join(" ") || "-"}
                    </TableCell>
                    <TableCell>{service.error || "-"}</TableCell>
                    <TableCell className="capitalize">
                      {formatStatus(service.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      {service.price ?? "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {service.paidAmount ?? "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              No service history found.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
