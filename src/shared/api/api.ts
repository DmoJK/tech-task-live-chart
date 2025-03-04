import { QueryClient } from "@tanstack/react-query"
import axios from "axios"

export const $api = axios.create({
  baseURL: "https://app.ftoyd.com/fronttemp-service",
})

export const queryClientApi = new QueryClient()
