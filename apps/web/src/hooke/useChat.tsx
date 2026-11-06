import { useState, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosPublic } from "@/hooke/useAxiosPublic"
import { useAuth } from "@/hooke/useAuth"
import { formatErrorMessage } from "@/hooke/AuthProvider"

// ==========================================
// 1. Interfaces & Types
// ==========================================

export interface ChatMessage {
  id: number | string
  role: "user" | "assistant"
  content: string
  created_at?: string
}

export interface ChatConversation {
  id: number
  title: string
  last_message?: string | null
  created_at: string
  updated_at: string
}

export interface ChatDetail {
  id: number
  title: string
  messages: ChatMessage[]
  created_at: string
  updated_at: string
}

export interface StreamMessageOptions {
  chatId: number
  message: string
  onToken: (token: string) => void
  onDone?: (data: { message_id: number; content: string }) => void
  onError?: (errorMessage: string) => void
  signal?: AbortSignal
}

// ==========================================
// 2. Direct API Call Functions
// ==========================================

/**
 * GET /api/v1/user/chat/
 * Retrieve all chat conversations belonging to the authenticated user.
 */
export const getChatsApi = async (): Promise<ChatConversation[]> => {
  const res = await axiosPublic.get<{ success: boolean; data: ChatConversation[] }>(
    "/api/v1/user/chat/"
  )
  const list = res.data?.data || []
  return Array.isArray(list) ? list : []
}

/**
 * POST /api/v1/user/chat/
 * Create a new skincare AI chat conversation for the authenticated user.
 */
export const createChatApi = async (): Promise<ChatDetail> => {
  const res = await axiosPublic.post<{
    success: boolean
    message: string
    data: ChatDetail
  }>("/api/v1/user/chat/")
  return res.data.data
}

/**
 * GET /api/v1/user/chat/{chat_id}/
 * Retrieve a specific chat conversation with its associated messages.
 */
export const getChatDetailApi = async (chatId: number): Promise<ChatDetail> => {
  const res = await axiosPublic.get<{ success: boolean; data: ChatDetail }>(
    `/api/v1/user/chat/${chatId}/`
  )
  return res.data.data
}

/**
 * DELETE /api/v1/user/chat/{chat_id}/
 * Delete a specific chat conversation and all associated messages.
 */
export const deleteChatApi = async (
  chatId: number
): Promise<{ success: boolean; message: string }> => {
  const res = await axiosPublic.delete<{ success: boolean; message: string }>(
    `/api/v1/user/chat/${chatId}/`
  )
  return res.data
}

/**
 * GET /api/v1/user/chat/{chat_id}/history/
 * Retrieve all messages from a specific chat conversation belonging to the authenticated user.
 */
export const getChatHistoryApi = async (chatId: number): Promise<ChatMessage[]> => {
  const res = await axiosPublic.get<{ success: boolean; data: ChatMessage[] }>(
    `/api/v1/user/chat/${chatId}/history/`
  )
  const list = res.data?.data || []
  return Array.isArray(list) ? list : []
}

/**
 * POST /api/v1/user/chat/{chat_id}/messages/
 * Send message to AI and stream response using Server-Sent Events (SSE).
 */
export const streamChatMessageApi = async ({
  chatId,
  message,
  onToken,
  onDone,
  onError,
  signal,
}: StreamMessageOptions): Promise<void> => {
  const baseURL = axiosPublic.defaults.baseURL || "http://localhost"
  const url = `${baseURL}/api/v1/user/chat/${chatId}/messages/`

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    credentials: "include",
    body: JSON.stringify({ message }),
    signal,
  })

  // If 401 Unauthorized, attempt cookie refresh and retry once
  if (response.status === 401) {
    try {
      await axiosPublic.post("/api/v1/cookie/refres/")
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        credentials: "include",
        body: JSON.stringify({ message }),
        signal,
      })
    } catch {
      // Refresh failed, proceed to error handling
    }
  }

  if (!response.ok) {
    let errorMsg = `Server returned status ${response.status}`
    try {
      const errJson = await response.json()
      errorMsg = errJson.message || errJson.detail || errorMsg
    } catch {
      // ignore
    }
    onError?.(errorMsg)
    return
  }

  if (!response.body) {
    onError?.("ReadableStream is not supported or response body is empty.")
    return
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder("utf-8")
  let buffer = ""
  let isDoneEmitted = false

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const normalized = buffer.replace(/\r\n/g, "\n")
      const chunks = normalized.split("\n\n")
      buffer = chunks.pop() || ""

      for (const chunk of chunks) {
        const trimmed = chunk.trim()
        if (!trimmed) continue

        let eventType = "message"
        let dataStr = ""

        const lines = trimmed.split("\n")
        for (const line of lines) {
          if (line.startsWith("event:")) {
            eventType = line.slice(6).trim()
          } else if (line.startsWith("data:")) {
            dataStr = line.slice(5).trim()
          }
        }

        if (!dataStr) continue

        let parsed: any = null
        try {
          parsed = JSON.parse(dataStr)
        } catch {
          parsed = dataStr
        }

        if (eventType === "token") {
          const content =
            typeof parsed === "object" && parsed !== null
              ? parsed.content ?? parsed.token ?? ""
              : String(parsed)
          onToken(content)
        } else if (eventType === "done") {
          isDoneEmitted = true
          onDone?.(parsed)
        } else if (eventType === "error") {
          const errMsg =
            typeof parsed === "object" && parsed !== null
              ? parsed.message || parsed.error || "Streaming error"
              : String(parsed)
          onError?.(errMsg)
        }
      }
    }

    // If stream ended without explicit done event, trigger completion
    if (!isDoneEmitted) {
      onDone?.({ message_id: 0, content: "" })
    }
  } catch (err: any) {
    if (err.name === "AbortError") {
      return
    }
    onError?.(err?.message || "Error reading AI stream.")
  }
}

// ==========================================
// 3. TanStack Query Hooks
// ==========================================

/**
 * Hook: Retrieve all chat conversations
 */
export function useChats() {
  const { user, loading: authLoading } = useAuth()

  const query = useQuery({
    queryKey: ["userChats"],
    queryFn: getChatsApi,
    enabled: !authLoading && Boolean(user),
    staleTime: 1000 * 30, // 30 seconds
    retry: 1,
  })

  return {
    ...query,
    chats: query.data || [],
    errorMessage: query.error
      ? formatErrorMessage(query.error, "Failed to load chats.")
      : null,
  }
}

/**
 * Hook: Retrieve chat messages history for a specific chat
 */
export function useChatHistory(chatId: number | null) {
  const { user, loading: authLoading } = useAuth()

  const query = useQuery({
    queryKey: ["chatHistory", chatId],
    queryFn: () => getChatHistoryApi(chatId!),
    enabled: Boolean(chatId) && !authLoading && Boolean(user),
    staleTime: 1000 * 15,
    retry: 1,
  })

  return {
    ...query,
    messages: query.data || [],
    errorMessage: query.error
      ? formatErrorMessage(query.error, "Failed to load chat history.")
      : null,
  }
}

/**
 * Hook: Mutation to create a new chat conversation
 */
export function useCreateChat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createChatApi,
    onSuccess: (newChat) => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] })
      if (newChat?.id) {
        queryClient.setQueryData(["chatHistory", newChat.id], [])
      }
    },
  })
}

/**
 * Hook: Mutation to delete a chat conversation
 */
export function useDeleteChat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteChatApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] })
    },
  })
}

/**
 * Hook: Manage real-time SSE AI message streaming with state & cancel support
 */
export function useSendMessageStream() {
  const queryClient = useQueryClient()
  const [isStreaming, setIsStreaming] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const sendMessage = async ({
    chatId,
    message,
    onToken,
    onDone,
    onError,
  }: {
    chatId: number
    message: string
    onToken: (token: string) => void
    onDone?: (data: { message_id: number; content: string }) => void
    onError?: (err: string) => void
  }) => {
    setIsStreaming(true)
    abortControllerRef.current = new AbortController()

    try {
      await streamChatMessageApi({
        chatId,
        message,
        onToken,
        onDone: (data) => {
          setIsStreaming(false)
          // Invalidate chats list so title & last_message update in the sidebar
          queryClient.invalidateQueries({ queryKey: ["userChats"] })
          // Invalidate chat message history
          queryClient.invalidateQueries({ queryKey: ["chatHistory", chatId] })
          onDone?.(data)
        },
        onError: (err) => {
          setIsStreaming(false)
          onError?.(err)
        },
        signal: abortControllerRef.current.signal,
      })
    } catch (err: any) {
      setIsStreaming(false)
      if (err.name !== "AbortError") {
        onError?.(err?.message || "Failed to send message.")
      }
    }
  }

  const stopStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsStreaming(false)
    }
  }

  return {
    sendMessage,
    isStreaming,
    stopStream,
  }
}

