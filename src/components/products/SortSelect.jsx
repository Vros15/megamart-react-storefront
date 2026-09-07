import { useSearchParams } from "react-router";
import "./SortSelect.css";

// Maps to the API's two params (sortBy, sortOrder) as one combined value -
// simpler for a shopper than two separate dropdowns.
const SORT_OPTIONS = [
  { value: "", label: "Sort: Featured", sortBy: "", sortOrder: "" },
  { value: "price-asc", label: "Price: Low to High", sortBy: "price", sortOrder: "asc" },
  { value: "price-desc", label: "Price: High to Low", sortBy: "price", sortOrder: "desc" },
  { value: "name-asc", label: "Name: A to Z", sortBy: "name", sortOrder: "asc" },
  { value: "name-desc", label: "Name: Z to A", sortBy: "name", sortOrder: "desc" },
];

const SortSelect = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") ?? "";
  const sortOrder = searchParams.get("sortOrder") ?? "";
  const current = SORT_OPTIONS.find((option) => option.sortBy === sortBy && option.sortOrder === sortOrder) ?? SORT_OPTIONS[0];

  const handleChange = (event) => {
    const option = SORT_OPTIONS.find((candidate) => candidate.value === event.target.value);
    const next = new URLSearchParams(searchParams);

    if (option.sortBy) {
      next.set("sortBy", option.sortBy);
      next.set("sortOrder", option.sortOrder);
    } else {
      next.delete("sortBy");
      next.delete("sortOrder");
    }
    setSearchParams(next);
  };

  return (
    <select className="sort-select" aria-label="Sort products" value={current.value} onChange={handleChange}>
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SortSelect;
