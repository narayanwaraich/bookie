// src/lib/socketEvents.ts (or a similar name)
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { getAuthToken } from "../lib/auth/authTokens"; // Your existing auth token helper
import { queryClient } from "../lib/queryClient";
import { trpc } from "../lib/api"; // To get queryKeys

// Define your socket event names (should match backend)
const SOCKET_EVENTS = {
  BOOKMARK_CREATED: "bookmark:created",
  BOOKMARK_UPDATED: "bookmark:updated",
  BOOKMARK_DELETED: "bookmark:deleted",
  // Add other events (folder, tag, collection)
};

let socket: Socket | null = null;

export function useSocketEvents() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || socket) {
      // console.log("Socket already initialized or connected.");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      console.log("No auth token, socket connection skipped.");
      return; // Don't connect if not authenticated
    }

    // Initialize socket connection
    // Ensure VITE_SOCKET_URL is defined in your .env
    const socketUrl =
      import.meta.env.VITE_SOCKET_URL || "http://localhost:3000"; // Fallback for safety

    console.log(`Attempting to connect to Socket.IO server at ${socketUrl}`);
    socket = io(socketUrl, {
      auth: {
        token: token,
      },
      // You might need withCredentials if your server CORS requires it and it's on a different subdomain
      // withCredentials: true,
      transports: ["websocket"], // Optional: force websocket
    });

    initialized.current = true;

    socket.on("connect", () => {
      console.log("Socket.IO connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket.IO disconnected:", reason);
      // Handle reconnection logic if needed, e.g., if token expired
      if (reason === "io server disconnect") {
        // Potentially force re-authentication or manual reconnect
        socket?.connect();
      }
      // socket = null; // Consider nullifying for re-init on next effect run if token changes
      // initialized.current = false;
    });

    socket.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err.message, err.data);
      // if (err.message === "Authentication error: No token provided") {
      // Potentially logout user or prompt re-login
      // }
    });

    // --- Event Listeners ---
    socket.on(SOCKET_EVENTS.BOOKMARK_CREATED, (newBookmark) => {
      console.log("EVENT: BOOKMARK_CREATED", newBookmark);
      // Invalidate queries that show lists of bookmarks
      // This is a broad invalidation, consider more specific ones if performance is an issue
      queryClient.invalidateQueries({
        queryKey: trpc.bookmarks.search.queryKey({}),
      });
      // Also invalidate recent bookmarks if you have that widget
      queryClient.invalidateQueries({
        queryKey: trpc.bookmarks.getRecent.queryKey(),
      });
      // You could also try to optimistically update the cache:
      // queryClient.setQueryData(trpc.bookmarks.search.queryKey({ ... }), (oldData: any) => {
      //   return oldData ? { ...oldData, bookmarks: [newBookmark, ...oldData.bookmarks] } : oldData;
      // });
    });

    socket.on(SOCKET_EVENTS.BOOKMARK_UPDATED, (updatedBookmark) => {
      console.log("EVENT: BOOKMARK_UPDATED", updatedBookmark);
      queryClient.invalidateQueries({
        queryKey: trpc.bookmarks.search.queryKey({}),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.bookmarks.getById.queryKey({ id: updatedBookmark.id }),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.bookmarks.getRecent.queryKey(),
      });
    });

    socket.on(
      SOCKET_EVENTS.BOOKMARK_DELETED,
      (deletedBookmark: { id: string }) => {
        console.log("EVENT: BOOKMARK_DELETED", deletedBookmark);
        queryClient.invalidateQueries({
          queryKey: trpc.bookmarks.search.queryKey({}),
        });
        // Remove from cache if it was a detail view
        queryClient.removeQueries({
          queryKey: trpc.bookmarks.getById.queryKey({ id: deletedBookmark.id }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.bookmarks.getRecent.queryKey(),
        });
      },
    );

    // TODO: Add listeners for FOLDER_CREATED, TAG_CREATED, COLLECTION_CREATED etc.
    // Example for folder:
    // socket.on('folder:created', (newFolder) => {
    //   console.log('EVENT: FOLDER_CREATED', newFolder);
    //   queryClient.invalidateQueries({ queryKey: trpc.folders.getTree.queryKey() });
    //   queryClient.invalidateQueries({ queryKey: trpc.folders.list.queryKey({}) });
    // });

    return () => {
      console.log("Cleaning up socket connection.");
      socket?.disconnect();
      socket = null;
      initialized.current = false;
    };
  }, [getAuthToken()]); // Re-run effect if auth token changes (e.g., after login/logout)

  // This hook doesn't return anything, it just sets up listeners
}
