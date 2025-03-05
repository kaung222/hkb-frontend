// ServiceModal.tsx
import React from "react";
import {Dialog, DialogContent, DialogHeader, DialogFooter} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

interface ServiceDetail {
    brand: string;
    model: string;

    [key: string]: any;
}

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    serviceDetail: ServiceDetail;
    setServiceDetail: React.Dispatch<React.SetStateAction<ServiceDetail>>;
}

const ServiceModal: React.FC<ServiceModalProps> = ({isOpen, onClose, onSave, serviceDetail, setServiceDetail}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <h2 className="text-lg font-semibold">Service Details</h2>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label>Brand</Label>
                        <Input
                            placeholder="Brand"
                            value={serviceDetail.brand || ""}
                            onChange={(e) => setServiceDetail({...serviceDetail, brand: e.target.value})}
                        />
                    </div>
                    <div>
                        <Label>Model</Label>
                        <Input
                            placeholder="Model"
                            value={serviceDetail.model || ""}
                            onChange={(e) => setServiceDetail({...serviceDetail, model: e.target.value})}
                        />
                    </div>
                    {/* Add other inputs as needed */}
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ServiceModal;
