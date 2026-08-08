import React, { forwardRef } from "react";
import BaseInput from "./BaseInput";
import { Search } from "lucide-react";

const SearchInput = forwardRef((props, ref) => {
  return (
    <BaseInput
      ref={ref}
      type="search"
      leftIcon={<Search className="w-4 h-4" />}
      {...props}
    />
  );
});

SearchInput.displayName = "SearchInput";

export default SearchInput;
