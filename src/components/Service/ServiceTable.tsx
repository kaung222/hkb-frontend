// ServiceTable.tsx
import React from 'react';
import {Table, TableRow, TableHead, TableBody, TableCell} from "@/components/ui/table";

interface Service {
    id: string;
    voucher: string;
    customer: string;
    phone: string;
    brand: string;
    model: string;

    [key: string]: any;
}

interface ServiceTableProps {
    services: Service[];
}

const ServiceTable: React.FC<ServiceTableProps> = ({services}) => {
    return (
        <div className="overflow-auto max-w-full shadow-md rounded-md">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Index</TableCell>
                        <TableCell>Voucher</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Brand</TableCell>
                        <TableCell>Model</TableCell>
                        {/* Add other headers as needed */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {services.map((service, index) => (
                        <TableRow key={service.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{service.voucher}</TableCell>
                            <TableCell>{service.customer}</TableCell>
                            <TableCell>{service.phone}</TableCell>
                            <TableCell>{service.brand}</TableCell>
                            <TableCell>{service.model}</TableCell>
                            {/* Add other data as needed */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ServiceTable;
