import React, { useState } from "react";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface DatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  placeholder: string;
  label: string;
  disabled?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  date,
  onDateChange,
  placeholder,
  label,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="grid gap-2">
      <label className="block text-sm font-medium text-gray-300 mb-2 font-mono text-center lg:text-left">
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            disabled={disabled}
            className="w-full max-w-xs mx-auto lg:mx-0 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black/40 text-gray-200 font-mono flex items-center justify-between disabled:opacity-50"
          >
            <span>{date ? format(date, "PPP") : placeholder}</span>
            <CalendarIcon className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
