import { IAnalysis } from "@/interfaces/analysis.types";
import React from "react";
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


  if (platform === 'x') {
    const match = url.split('/status/');
    const tweetId = match[1];
    return (
      <div className="w-full flex justify-center items-center">
        <TweetEmbed className="w-full" tweetId={tweetId} options={{ theme: 'dark', align: 'center' }} />
      </div>
    );
  }

  if (platform === 'facebook') {
    return (
      <div className="w-full flex justify-center items-center">
          <FacebookEmbed url={url} className="w-full" />
      </div>
    );
  }

  if (platform === 'instagram') {
    return (
      <div className="w-full flex justify-center items-center">
        <InstagramEmbed url={url}  className="w-full"/>
    </div>
    );
  }

  if (platform === 'linkedin') {
    return (
      <div className="w-full flex justify-center items-center">
          <LinkedInEmbed url={url} className="w-full" />
      </div>
    );
  }

  if (platform === 'tiktok') {
    return (
      <div className="w-full flex justify-center items-center">
          <TikTokEmbed url={url} className="w-full" />
      </div>
    );
  }

  if (platform === 'youtube') {
    return (
      <div className="w-full flex justify-center items-center">
          <YouTubeEmbed url={url} className="w-full" />
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