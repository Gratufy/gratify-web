import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { OnlineFilter } from "@/types";

function OnlineStatusFilter({
  value,
  onChange,
}: {
  value: OnlineFilter;
  onChange: (val: OnlineFilter) => void;
}) {
  return (
    <div className="space-y-2 my-4">
      <Label>Online Status</Label>
      <RadioGroup value={value} onValueChange={onChange} className="flex gap-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="all" />
          <Label htmlFor="all">Всі</Label>
        </div>

        <div className="flex items-center space-x-2">
          <RadioGroupItem value="online" id="online" />
          <Label htmlFor="online">Online</Label>
        </div>

        <div className="flex items-center space-x-2">
          <RadioGroupItem value="offline" id="offline" />
          <Label htmlFor="offline">Offline</Label>
        </div>
      </RadioGroup>
    </div>
  );
}

export default OnlineStatusFilter;
