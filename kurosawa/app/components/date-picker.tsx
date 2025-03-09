import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useState } from "react";
import { CalendarIcon, CalendarRange } from "lucide-react";
import { format } from "@formkit/tempo";
import { Calendar } from "./ui/calendar";

interface IProps {
  _onSelect: (date: Date | undefined) => void;
}

export const DatePicker = ({ _onSelect }: IProps) => {
  const [date, setDate] = useState<Date>(new Date());
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant="outline"
          className={cn("justify-start text-left font-normal px-3")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(date, "YYYY年MM月DD日")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 " align="start">
        <Calendar
          initialFocus
          month={date}
          mode="single"
          selected={date}
          onMonthChange={(month) => setDate(month)}
          onSelect={(date) => _onSelect(date)}
        />
      </PopoverContent>
    </Popover>
  );
};
