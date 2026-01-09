import React from "react"

interface YearPickerProps {
  year: string
  onChange: (year: string) => void
  size?: "default" | "small"
}

const YearPicker: React.FC<YearPickerProps> = ({ year, onChange, size = "default" }) => {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString())

  const isSmall = size === "small"

  return (
    <select
      name="year"
      value={year}
      onChange={e => onChange(e.target.value)}
      className={`border border-[var(--border)] rounded-[100px] appearance-none text-[#666666] leading-none focus:outline-none focus:border-[var(--primary)] ${
        isSmall
          ? "px-3 pr-10 text-sm h-8 w-[100px]"
          : "px-4 pr-12 text-sm md:text-[15px] h-[39px] w-[110px]"
      }`}
      style={{
        backgroundImage: "url(\"data:image/svg+xml,%3csvg fill='%23666666' height='32' viewBox='0 0 24 24' width='32' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: isSmall ? "right 6px center" : "right 10px center",
        backgroundSize: isSmall ? "24px 26px" : "28px 30px",
      }}
    >
      {years.map(y => (<option key={y} value={y}>{y}</option>))}
    </select>
  )
}

export default YearPicker
