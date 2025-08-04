import React, { useState, useEffect } from "react";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useToast } from "../../hooks/use-toast";

interface DateFilterFormProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onSearch: () => void;
  loading?: boolean;
}

export const DateFilterForm = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onSearch,
  loading = false,
}: DateFilterFormProps) => {
  const [startDateObj, setStartDateObj] = useState<Date | undefined>(undefined);
  const [endDateObj, setEndDateObj] = useState<Date | undefined>(undefined);
  const [isRangeMode, setIsRangeMode] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Fix for timezone/off-by-one issue
    setStartDateObj(startDate ? new Date(startDate + "T00:00:00") : undefined);
    setEndDateObj(endDate ? new Date(endDate + "T00:00:00") : undefined);
  }, [startDate, endDate]);

  const formatDateToLocalString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;

    if (!isRangeMode) {
      // Single day mode
      setStartDateObj(date);
      setEndDateObj(date);
      onStartDateChange(formatDateToLocalString(date));
      onEndDateChange(formatDateToLocalString(date));
    } else {
      // Range mode
      if (!startDateObj || (startDateObj && endDateObj)) {
        // First selection or reset
        setStartDateObj(date);
        setEndDateObj(undefined);
        onStartDateChange(formatDateToLocalString(date));
        onEndDateChange("");
      } else {
        // Second selection - check 7-day limit
        const daysDiff = Math.ceil(
          (date.getTime() - startDateObj!.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff > 6) {
          // If more than 6 days difference (7 days total), limit to 6 days from start date
          const maxEndDate = new Date(
            startDateObj!.getTime() + 6 * 24 * 60 * 60 * 1000
          );
          setEndDateObj(maxEndDate);
          onEndDateChange(formatDateToLocalString(maxEndDate));

          toast({
            title: "Date Range Limited",
            description:
              "NASA API allows a maximum of 7 days. Your selection has been adjusted.",
            variant: "default",
          });
        } else if (date < startDateObj!) {
          // If selected date is before start date, swap them
          setStartDateObj(date);
          setEndDateObj(startDateObj);
          onStartDateChange(formatDateToLocalString(date));
          onEndDateChange(formatDateToLocalString(startDateObj));
        } else {
          setEndDateObj(date);
          onEndDateChange(formatDateToLocalString(date));
        }
      }
    }
  };

  const handleRangeChange = (range: DateRange | undefined) => {
    if (!range) return;

    setStartDateObj(range.from);
    setEndDateObj(range.to);

    if (range.from) {
      onStartDateChange(formatDateToLocalString(range.from));
    }
    if (range.to) {
      // Check 7-day limit
      const daysDiff = Math.ceil(
        (range.to.getTime() - range.from!.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff > 6) {
        // If more than 6 days difference (7 days total), limit to 6 days from start date
        const maxEndDate = new Date(
          range.from!.getTime() + 6 * 24 * 60 * 60 * 1000
        );
        setEndDateObj(maxEndDate);
        onEndDateChange(formatDateToLocalString(maxEndDate));

        toast({
          title: "Date Range Limited",
          description:
            "NASA API allows a maximum of 7 days. Your selection has been adjusted.",
          variant: "default",
        });
      } else {
        onEndDateChange(formatDateToLocalString(range.to));
      }
    } else {
      onEndDateChange("");
    }
  };

  const getDisplayText = () => {
    if (!startDateObj) return "Select date";
    if (!isRangeMode) {
      return format(startDateObj, "PPP");
    }
    if (!endDateObj) {
      return `${format(startDateObj, "PPP")} - Select end date`;
    }
    return `${format(startDateObj, "PPP")} - ${format(endDateObj, "PPP")}`;
  };

  const getSelectedDates = () => {
    if (!isRangeMode) {
      return startDateObj ? [startDateObj] : [];
    }
    if (!startDateObj) return [];
    if (!endDateObj) return [startDateObj];
    return [startDateObj, endDateObj];
  };

  return (
    <div className="max-w-4xl mx-auto border border-gray-700 rounded-lg p-6 mb-8 bg-black/20 backdrop-blur-sm">
      <div className="mb-4 p-3 border border-gray-600 rounded-lg bg-black/40">
        <p className="text-sm text-gray-300 font-mono">
          <span className="text-blue-400">NOTE:</span> NASA API allows a maximum
          date range of 7 days. Please select dates within this limit for best
          results.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-end">
        <div className="w-full lg:flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-2 font-mono text-center lg:text-left">
            DATE SELECTION
          </label>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full max-w-md mx-auto lg:mx-0 justify-start text-left font-mono"
                disabled={loading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {getDisplayText()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3 border-b border-gray-600">
                <div className="flex gap-2 mb-3">
                  <Button
                    size="sm"
                    variant={!isRangeMode ? "default" : "outline"}
                    onClick={() => setIsRangeMode(false)}
                    className={`text-xs font-medium ${
                      !isRangeMode
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    Single Day
                  </Button>
                  <Button
                    size="sm"
                    variant={isRangeMode ? "default" : "outline"}
                    onClick={() => setIsRangeMode(true)}
                    className={`text-xs font-medium ${
                      isRangeMode
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    Date Range
                  </Button>
                </div>
                <p className="text-xs text-gray-400 font-mono">
                  {isRangeMode
                    ? "Select start date, then end date"
                    : "Select a single day"}
                </p>
              </div>
              {isRangeMode ? (
                <Calendar
                  mode="range"
                  selected={{ from: startDateObj, to: endDateObj }}
                  onSelect={handleRangeChange}
                  initialFocus
                />
              ) : (
                <Calendar
                  mode="single"
                  selected={startDateObj}
                  onSelect={handleDateChange}
                  initialFocus
                />
              )}
            </PopoverContent>
          </Popover>
        </div>
        <button
          onClick={onSearch}
          disabled={loading}
          className="w-full lg:w-auto px-6 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-colors font-mono border border-gray-600 disabled:bg-gray-900 disabled:text-gray-500"
        >
          {loading ? "SCANNING..." : "SCAN"}
        </button>
      </div>
    </div>
  );
};
