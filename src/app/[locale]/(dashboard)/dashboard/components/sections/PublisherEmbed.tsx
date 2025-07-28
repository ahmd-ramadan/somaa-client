import { IAnalysis } from "@/interfaces/analysis.types";
import React, { useRef } from "react";
import {
  FacebookEmbed,
  YouTubeEmbed,
  TikTokEmbed,
  LinkedInEmbed,
  InstagramEmbed
} from 'react-social-media-embed';
import TweetEmbed from "react-tweet-embed";


interface PublisherEmbedProps {
  analysis: IAnalysis; 
}

const PublisherEmbed: React.FC<PublisherEmbedProps> = ({ analysis }) => {
  const { platform, url } = analysis;
  const containerRef = useRef<HTMLDivElement>(null);


  if (platform === 'x') {
    const match = url.split('/status/');
    const tweetId = match[1];
    return (
      <div className="w-full h-full overflow-auto custom-scrollbar">
        <TweetEmbed className="w-full h-full overflow-auto custom-scrollbar" tweetId={tweetId} options={{ theme: 'dark', align: 'center' }} />
      </div>
    );
  }

  if (platform === 'facebook') {
    return (
      <div className="w-full overflow-auto custom-scrollbar text-white">
          <FacebookEmbed url={url} className="w-full h-full overflow-auto custom-scrollbar" />
      </div>
    );
  }

  if (platform === 'instagram') {
    return (
      <div className="w-full flex justify-center items-center overflow-auto custom-scrollbar">
        <InstagramEmbed url={url}  className="w-full h-full overflow-auto custom-scrollbar"/>
    </div>
    );
  }

  if (platform === 'linkedin') {
    return (
      <div className="w-full flex justify-center items-center overflow-auto custom-scrollbar">
          <LinkedInEmbed url={url} className="w-full h-full overflow-auto custom-scrollbar" />
      </div>
    );
  }

  if (platform === 'tiktok') {
    // Try to extract the video ID from the URL
    const match = url.match(/video\/(\d+)/);
    const videoId = match ? match[1] : null;
    // Use a placeholder or TikTok's thumbnail API if available
    const thumbnail = videoId
      ? `https://www.tiktok.com/api/img/?itemId=${videoId}`
      : '/tiktok-placeholder.png';

    return (
      <div className="w-full flex justify-center items-center overflow-auto custom-scrollbar">
        <iframe
          src={`https://www.tiktok.com/embed/v2/${videoId}`}
          // width="325"
          height="400"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="w-full rounded-lg border"
        />
      </div>
    );
  }

  if (platform === 'youtube') {
    return (
      <div className="w-full flex justify-center items-center overflow-auto custom-scrollbar">
          <YouTubeEmbed url={url} className="w-full h-full overflow-auto custom-scrollbar" />
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center max-h-[100px]">
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">رابط المنشور</a>
    </div>
  );
};

export default PublisherEmbed; 