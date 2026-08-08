import React, { forwardRef } from "react";
import BaseInput from "./BaseInput";
import { Calendar } from "lucide-react";

const DateInput = forwardRef((props, ref) => {
  return (
    <BaseInput
      ref={ref}
      type="date"
      rightIcon={<Calendar className="w-4 h-4 pointer-events-none" />}
      className="appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
      {...props}
    />
  );
});

DateInput.displayName = "DateInput";

export default DateInput;
