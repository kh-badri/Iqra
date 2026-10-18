export interface YouTubeChannel {
  id: string;
  name: string;
  ustadz: string;
  handle: string;
  description: string;
  avatar: string;
  url: string;
  subscribers?: string;
  specialty?: string;
  initials?: string;
}

export interface VideoItem {
  id: string;
  channelId: string;
  title: string;
  ustadz: string;
  category: string;
  duration: string;
  publishedAt: string;
  summary: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
}

export interface ChannelsData {
  channels: YouTubeChannel[];
  categories: string[];
  videos: VideoItem[];
}
