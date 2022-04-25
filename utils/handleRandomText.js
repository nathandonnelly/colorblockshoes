import { messages } from "../data/text";

export const handleRandomMessage = () => {
  return messages[Math.floor(Math.random() * messages.length)];
}