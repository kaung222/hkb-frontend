import { useGetSingleService } from "@/api/service/service.query";
import React from "react";
import { useParams } from "react-router-dom";
import { Status } from "./Service";

const ServiceDetails = () => {
  const params = useParams();
  const { data } = useGetSingleService();
  console.log(params);
  if (!data || data.status === Status.RETRIEVED)
    return <div className="">No service found</div>;
  return (
    <div>
      <h2>Service Details for user</h2>
      {data.username}
    </div>
  );
};

export default ServiceDetails;
