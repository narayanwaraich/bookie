import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileUp, Settings } from "lucide-react";
import { Link } from "@tanstack/react-router";
// import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'; // For forms
// import { AddBookmarkForm } from '@/components/features/bookmarks/forms/AddBookmarkForm'; // For forms

export function QuickActionsWidget() {
  // const [isAddBookmarkOpen, setIsAddBookmarkOpen] = React.useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks at your fingertips.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {/* <Dialog open={isAddBookmarkOpen} onOpenChange={setIsAddBookmarkOpen}>
          <DialogTrigger asChild> */}
        <Button variant="outline" className="w-full justify-start">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Bookmark
        </Button>
        {/* </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Bookmark</DialogTitle></DialogHeader>
            <AddBookmarkForm onSuccess={() => setIsAddBookmarkOpen(false)} />
          </DialogContent>
        </Dialog> */}

        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/import-export">
            <FileUp className="mr-2 h-4 w-4" /> Import/Export Data
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/settings/profile">
            <Settings className="mr-2 h-4 w-4" /> Manage Settings
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
