import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

interface Props {
  className?: string;
}
const Spinner = ({ className }: Props) => {
  return (
    <Loader
      size={20}
      className={cn("animate-spin fill-white stroke-white", className)}
    />
  );
};

export default Spinner;
