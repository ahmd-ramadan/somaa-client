export interface AnalysisData {
    id: string
    content: string
    sentiment: "positive" | "negative" | "neutral"
    location: {
      lat: number
      lng: number
      name: string
    }
    timestamp: Date
    publisher: {
      name: string
      avatar: string
    }
    statistics: {
      views: number
      shares: number
      likes: number
    }
    isFlagged?: boolean
  }
  
  export interface NewsData {
    id: string
    title: string
    content: string
    sentiment: "positive" | "negative" | "neutral"
    isFlagged: boolean
    timestamp: Date
    publisher: {
      name: string
      avatar: string
    }
    statistics: {
      views: number
      shares: number
      likes: number
    }
  }
  
  export interface SectorData {
    name: string
    count: number
    positive: number
    negative: number
    neutral: number
  }
  
  export interface PublisherStats {
    name: string
    avatar: string
    totalCount: number
    statistics: {
      views: number
      shares: number
      likes: number
    }
  }
  
  export interface DashboardStats {
    sentimentCounts: {
      positive: number
      negative: number
      neutral: number
    }
    analysisCount: number
    newsCount: number
    subAnalysis: Array<{
      name: string
      count: number
    }>
  }
  