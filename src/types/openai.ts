export interface ChatCompletionBody {
  model: string
  messages: {
    role: string
    content: string
  }[]
  tools?: any[]
  tool_choice?: any
  stream?: boolean
}