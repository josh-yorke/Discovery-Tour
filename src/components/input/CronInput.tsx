import { useState, useEffect } from "react";

interface CronInputProps {
  title?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  style?: string;
  value?: string;
  onChange?: (value: string) => void;
  description?: string;
  required?: boolean;
}

const CronInput = ({
  title,
  placeholder = "0 0 * * *",
  error,
  disabled = false,
  style = "",
  value = "",
  onChange,
  description,
  required = false,
}: CronInputProps) => {
  const [showPresets, setShowPresets] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [minute, setMinute] = useState("*");
  const [hour, setHour] = useState("*");
  const [day, setDay] = useState("*");
  const [month, setMonth] = useState("*");
  const [weekday, setWeekday] = useState("*");

  useEffect(() => {
    if (value && !showBuilder) {
      const parts = value.split(" ");
      if (parts.length === 5) {
        setMinute(parts[0]);
        setHour(parts[1]);
        setDay(parts[2]);
        setMonth(parts[3]);
        setWeekday(parts[4]);
      }
    }
  }, [value, showBuilder]);

  const buildCronFromSelectors = () => {
    const cronString = `${minute} ${hour} ${day} ${month} ${weekday}`;
    onChange?.(cronString);
    setShowBuilder(false);
  };

  const presets = [
    {
      label: "Every minute",
      value: "* * * * *",
      description: "Runs every minute",
    },
    {
      label: "Every 5 minutes",
      value: "*/5 * * * *",
      description: "Runs every 5 minutes",
    },
    {
      label: "Every 15 minutes",
      value: "*/15 * * * *",
      description: "Runs every 15 minutes",
    },
    {
      label: "Every 30 minutes",
      value: "*/30 * * * *",
      description: "Runs every 30 minutes",
    },
    {
      label: "Every hour",
      value: "0 * * * *",
      description: "Runs at the start of every hour",
    },
    {
      label: "Every 2 hours",
      value: "0 */2 * * *",
      description: "Runs every 2 hours",
    },
    {
      label: "Every 6 hours",
      value: "0 */6 * * *",
      description: "Runs every 6 hours",
    },
    {
      label: "Daily at midnight",
      value: "0 0 * * *",
      description: "Runs once per day at midnight",
    },
    {
      label: "Daily at 9 AM",
      value: "0 9 * * *",
      description: "Runs once per day at 9:00 AM",
    },
    {
      label: "Daily at 6 PM",
      value: "0 18 * * *",
      description: "Runs once per day at 6:00 PM",
    },
    {
      label: "Weekly on Monday",
      value: "0 9 * * 1",
      description: "Runs every Monday at 9:00 AM",
    },
    {
      label: "Weekly on Sunday",
      value: "0 9 * * 0",
      description: "Runs every Sunday at 9:00 AM",
    },
    {
      label: "First day of month",
      value: "0 0 1 * *",
      description: "Runs on the 1st of each month at midnight",
    },
    {
      label: "Last day of month",
      value: "0 0 L * *",
      description: "Runs on the last day of each month",
    },
  ];

  const minuteOptions = [
    { value: "*", label: "Every minute" },
    { value: "*/5", label: "Every 5 minutes" },
    { value: "*/10", label: "Every 10 minutes" },
    { value: "*/15", label: "Every 15 minutes" },
    { value: "*/30", label: "Every 30 minutes" },
    { value: "0", label: "At minute 0" },
    { value: "15", label: "At minute 15" },
    { value: "30", label: "At minute 30" },
    { value: "45", label: "At minute 45" },
  ];

  const hourOptions = [
    { value: "*", label: "Every hour" },
    { value: "*/2", label: "Every 2 hours" },
    { value: "*/3", label: "Every 3 hours" },
    { value: "*/4", label: "Every 4 hours" },
    { value: "*/6", label: "Every 6 hours" },
    { value: "*/8", label: "Every 8 hours" },
    { value: "*/12", label: "Every 12 hours" },
    { value: "0", label: "At midnight (12 AM)" },
    { value: "6", label: "At 6 AM" },
    { value: "9", label: "At 9 AM" },
    { value: "12", label: "At noon (12 PM)" },
    { value: "15", label: "At 3 PM" },
    { value: "18", label: "At 6 PM" },
    { value: "21", label: "At 9 PM" },
  ];

  const dayOptions = [
    { value: "*", label: "Every day" },
    { value: "*/2", label: "Every 2 days" },
    { value: "*/3", label: "Every 3 days" },
    { value: "1", label: "1st" },
    { value: "5", label: "5th" },
    { value: "10", label: "10th" },
    { value: "15", label: "15th" },
    { value: "20", label: "20th" },
    { value: "25", label: "25th" },
    { value: "L", label: "Last day" },
  ];

  const monthOptions = [
    { value: "*", label: "Every month" },
    { value: "*/2", label: "Every 2 months" },
    { value: "*/3", label: "Every 3 months" },
    { value: "*/4", label: "Every 4 months" },
    { value: "*/6", label: "Every 6 months" },
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const weekdayOptions = [
    { value: "*", label: "Every day" },
    { value: "0", label: "Sunday" },
    { value: "1", label: "Monday" },
    { value: "2", label: "Tuesday" },
    { value: "3", label: "Wednesday" },
    { value: "4", label: "Thursday" },
    { value: "5", label: "Friday" },
    { value: "6", label: "Saturday" },
    { value: "1-5", label: "Monday to Friday" },
    { value: "0,6", label: "Weekends" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const handlePresetSelect = (cronValue: string) => {
    onChange?.(cronValue);
    setShowPresets(false);
  };

  const getHumanReadable = () => {
    if (!value || value === "* * * * *") return "Runs every minute";

    const parts = value.split(" ");
    if (parts.length !== 5) return null;

    const [min, hr, dayVal, mon, wday] = parts;

    const getMinuteText = (m: string) => {
      if (m === "*") return "every minute";
      if (m === "*/5") return "every 5 minutes";
      if (m === "*/10") return "every 10 minutes";
      if (m === "*/15") return "every 15 minutes";
      if (m === "*/30") return "every 30 minutes";
      if (m === "0") return "at minute 0";
      return `at minute ${m}`;
    };

    const getHourText = (h: string) => {
      if (h === "*") return "";
      if (h === "*/2") return "every 2 hours";
      if (h === "*/3") return "every 3 hours";
      if (h === "*/4") return "every 4 hours";
      if (h === "*/6") return "every 6 hours";
      const hourNum = parseInt(h);
      if (hourNum === 0) return "at midnight";
      if (hourNum < 12) return `at ${hourNum} AM`;
      if (hourNum === 12) return "at noon";
      return `at ${hourNum - 12} PM`;
    };

    const getDayText = (d: string) => {
      if (d === "*") return "";
      if (d === "L") return "on the last day";
      return `on day ${d}`;
    };

    const getMonthText = (m: string) => {
      if (m === "*") return "";
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return m === "*" ? "" : `in ${months[parseInt(m) - 1]}`;
    };

    const getWeekdayText = (w: string) => {
      if (w === "*") return "";
      const weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      if (w === "1-5") return "on weekdays";
      if (w === "0,6") return "on weekends";
      return `on ${weekdays[parseInt(w)]}`;
    };

    const minuteText = getMinuteText(min);
    const hourText = getHourText(hr);
    const dayText = getDayText(dayVal);
    const monthText = getMonthText(mon);
    const weekdayText = getWeekdayText(wday);

    const parts_text = [
      minuteText,
      hourText,
      dayText,
      monthText,
      weekdayText,
    ].filter((p) => p);
    return parts_text.join(" ");
  };

  const humanReadable = getHumanReadable();

  return (
    <div className="w-full flex flex-col items-start justify-center gap-2 text-sm">
      {title && (
        <p className="font-semibold capitalize">
          {title}
          {required && <span className="text-red-500 ml-1">*</span>}
        </p>
      )}

      <div className="relative w-full">
        <div className="flex gap-2">
          <input
            type="text"
            className={`flex-1 px-6 py-3 outline-none rounded-full font-mono text-sm ${style} ${
              error ? "border-2 border-red-500" : ""
            } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            disabled={disabled}
          />

          {!disabled && (
            <>
              <button
                type="button"
                onClick={() => setShowBuilder(!showBuilder)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                title="Build cron expression"
              >
                🛠️ Build
              </button>
              <button
                type="button"
                onClick={() => setShowPresets(!showPresets)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                title="Select preset"
              >
                📋 Presets
              </button>
            </>
          )}
        </div>
      </div>

      {description && <p className="text-xs text-gray-500">{description}</p>}

      {humanReadable && value && value !== "* * * * *" && (
        <div className="mt-1 p-3 bg-blue-50 rounded-lg w-full border border-blue-200">
          <p className="text-xs font-medium text-blue-800 mb-1">
            📅 Schedule description:
          </p>
          <p className="text-sm text-blue-900 font-medium">{humanReadable}</p>
        </div>
      )}

      {error && <p className="text-red-700 text-xs">{error}</p>}

      {/* Builder Modal */}
      {showBuilder && !disabled && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setShowBuilder(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-[#1d2087]">
                Build Cron Expression
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Select when you want the task to run
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minute
                </label>
                <select
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#1d2087] focus:outline-none"
                >
                  {minuteOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hour
                </label>
                <select
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#1d2087] focus:outline-none"
                >
                  {hourOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Day of Month
                </label>
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#1d2087] focus:outline-none"
                >
                  {dayOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Month
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#1d2087] focus:outline-none"
                >
                  {monthOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Day of Week
                </label>
                <select
                  value={weekday}
                  onChange={(e) => setWeekday(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#1d2087] focus:outline-none"
                >
                  {weekdayOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Preview:</p>
                <p className="font-mono text-sm">
                  {minute} {hour} {day} {month} {weekday}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowBuilder(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={buildCronFromSelectors}
                className="flex-1 px-4 py-2 rounded-lg bg-[#1d2087] text-white font-medium hover:bg-[#3b3eac]"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}

      {/* Presets Modal */}
      {showPresets && !disabled && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setShowPresets(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-2xl">
              <h3 className="text-xl font-bold text-[#1d2087]">Cron Presets</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handlePresetSelect(preset.value)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-800">
                    {preset.label}
                  </div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    {preset.value}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {preset.description}
                  </div>
                </button>
              ))}
            </div>
            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowPresets(false)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CronInput;
