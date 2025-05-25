import { useMemo, useState } from "react";
import { useUpdatePageTitle } from "@/modules/hooks/page.hooks";
import debounce from "lodash.debounce";
import { Page } from "shared/src/generated";

interface PageContentViewProps {
  page: Page;
  pageId: string;
}

export default function PageContentView({
  page,
  pageId,
}: PageContentViewProps) {
  const [titleValue, setTitleValue] = useState(page.title);

  const { optimisticallyUpdateTitle, persistTitleChange } =
    useUpdatePageTitle();

  const debouncedPersistTitle = useMemo(
    () =>
      debounce((id: string, newTitle: string) => {
        persistTitleChange(id, newTitle);
      }, 300),
    [persistTitleChange]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitleValue(newTitle);
    optimisticallyUpdateTitle(pageId, newTitle);
    debouncedPersistTitle(pageId, newTitle);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        value={titleValue}
        onChange={handleTitleChange}
        placeholder="Untitled"
        className="border-none text-xl font-semibold w-full focus:outline-none"
      />
    </div>
  );
}
