import React, { useState } from "react"; // Import useState
import { File } from "lucide-react";

import { FolderTree } from "@/components/features/folders/FolderTree"; // Import the new component
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SearchForm } from "@/components/features/folders/SidebarSearchForm";

// TODO: Replace with actual data fetching or state management
const changesData = [
  {
    file: "All",
    state: "1024",
  },
  {
    file: "Unsorted",
    state: "128",
  },
  {
    file: "Recent",
    state: "8",
  },
];

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(
    undefined,
  );

  const handleFolderSelection = (folderId: string) => {
    setSelectedFolderId(folderId);
    // You might want to trigger other actions here, like fetching bookmarks for the selected folder
    console.log("Selected folder:", folderId);
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Changes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {changesData.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton>
                    <File />
                    {item.file}
                  </SidebarMenuButton>
                  <SidebarMenuBadge>{item.state}</SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Folders</SidebarGroupLabel>
          <SidebarGroupContent>
            {/* Use the new SidebarFolderTree component */}
            <FolderTree
              selectedFolderId={selectedFolderId}
              onFolderSelect={handleFolderSelection}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
