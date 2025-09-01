import { OnlineFilter, SortBy } from '@/types';
import React from 'react';

type SortFilterProps = {
  sortBy: SortBy;
  setSortBy: (sort: SortBy) => void;
  showOnlineStatus: OnlineFilter;
  setShowOnlineStatus: (status: OnlineFilter) => void;
};

function SortFilter({
  sortBy,
  setSortBy,
  showOnlineStatus,
  setShowOnlineStatus,
}: SortFilterProps) {
  return <div>SortFilter</div>;
}

export default SortFilter;
