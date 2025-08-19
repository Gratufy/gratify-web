"use client";
import React, { useState } from "react";
import { AdminBusinessRow, BusinessReviewStatus } from "@/types";

import CustomSelect from "../ui/CustomSelect";
import { BUSINESS_REVIEW_STATUS } from "@/const/review";

import Link from "next/link";
import { useAdminBusinessesByReviewStatus } from "@/hooks/useBusinesses";
import BusinessReviewForm from "./BusinessReviewForm";
import { useBusinessReviews } from "@/hooks/useReviews";
import AdminReviewList from "./AdminReviewList";

interface BusinessTableProps {
  initialData: AdminBusinessRow[];
}
const BusinessTable = ({ initialData }: BusinessTableProps) => {
  const [status, setStatus] = useState<BusinessReviewStatus>("pending");
  const [showReviews, setShowReviews] = useState(false);
  const { data: businesses, isLoading } = useAdminBusinessesByReviewStatus(
    status
    //categoryId ?? undefined
  );

  function handleStatusChange(value: string) {
    setStatus(value as BusinessReviewStatus);
  }
  return (
    <div className="flex flex-col items-center justify-center w-full ">
      <CustomSelect
        value={status}
        onChange={handleStatusChange}
        options={BUSINESS_REVIEW_STATUS}
        getOptionValue={(s) => s}
        getOptionLabel={(s) => s.charAt(0).toUpperCase() + s.slice(1)}
        placeholder="Оберіть статус"
        className="w-36"
        statusForm={true}
      />
      {businesses?.length ? (
        <ul className="w-3/4 max-w-4xl mt-4">
          {businesses.map((b) => (
            <div key={b.id}>
              <li className="mb-2 px-4 py-2 border border-gray-300 rounded-xl flex gap-8 items-center justify-center">
                <p className="flex-1/6">{b.name}</p>
                <p className="flex-1/6">{b.city}</p>
                <p className="flex-1/6">
                  {status}: {b.filteredReviewCount}
                </p>
                <button
                  className="border rounded-3xl border-black btn-secondary cursor-pointer px-4 py-2 flex items-center justify-center"
                  onClick={() => setShowReviews(!showReviews)}
                >
                  {showReviews ? "Hide Reviews" : "Show Reviews"}
                </button>
                {/* <p className="flex-1/6">{b.categoryName}</p> */}

                <Link
                  href={`/admin/business/${b.id}`}
                  className="px-4 py-2 bg-chart-2 text-white rounded-full cursor-pointer"
                >
                  See more
                </Link>
              </li>
              {showReviews && (
                <AdminReviewList businessId={b.id} currentStatus={status} />
              )}
            </div>
          ))}
        </ul>
      ) : (
        <p className="text-2xl"> Нема бізнесів</p>
      )}
    </div>
  );
};

export default BusinessTable;
