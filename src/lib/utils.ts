import { User } from "@/types/user";
import { clsx, type ClassValue } from "clsx";
import { format, parse } from "date-fns";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const generateVoucher = (branch: string, saleCount: number): string => {
//   const paddedCount = saleCount.toString().padStart(4, "0");
//   return `HKB_B${branch}_${new Date()
//     .toISOString()
//     .slice(0, 10)}_${paddedCount}`;
// };

export const generateVoucher = (branch: string, serviceLength: number) => {
  const idService = (serviceLength + 1).toString().padStart(4, "0"); // Ensures 4 digits with leading zeros
  const currentDate = new Date().toISOString().slice(0, 10); // Gets current date in YYYY-MM-DD format

  const voucher = `HKB_B${branch}_${currentDate}_${idService}`;
  return voucher;
};

export const checkRole = (currentUser: User) => {
  if (currentUser.role !== "admin") {
    toast.error("You don't have admin permission.");
    console.log(currentUser);
    return false;
  }
  return true;
};

export const customFormatDate = (
  dateString: string,
  outputFormat: string = "MMM d, yyyy h:mm a"
): string => {
  try {
    const parsedDate = parse(dateString, "yyyy-MM-dd HH:mm:ss", new Date());

    // Check if parsed date is valid
    if (isNaN(parsedDate.getTime())) {
      return "Invalid Date";
    }

    return format(parsedDate, outputFormat);
  } catch (error) {
    console.log(error);
    return "Invalid Date";
  }
};
