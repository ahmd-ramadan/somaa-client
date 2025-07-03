import { IAnalysis } from "@/interfaces/analysis.types";
import React, { useRef } from "react";
import TweetEmbed from 'react-tweet-embed';
import { InstagramEmbed } from 'react-social-media-embed';


interface PublisherEmbedProps {
  analysis: IAnalysis; 
}

const PublisherEmbed: React.FC<PublisherEmbedProps> = ({ analysis }) => {
  const { platform, url } = analysis;


  if (platform === 'x') {
    // Extract tweet ID from URL
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
        <iframe
          src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=true&width=500`}
          width="500"
          height="350"
          style={{ border: 'none', overflow: 'hidden' }}
          scrolling="no"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  if (platform === 'instagram') {
    return (
      <div className="w-full flex justify-center items-center">
        <InstagramEmbed url={url} width={400} />
      </div>
    );
  }

  if (platform === 'linkedin') {
    return (
      <div className="w-full flex justify-center items-center max-h-[350px] overflow-auto custom-scrollba">
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">عرض منشور LinkedIn</a>
      </div>
    );
  }

  if (platform === 'tiktok') {
    return (
      <div className="w-full flex justify-center items-center">
        <blockquote className="tiktok-embed" cite={url} data-video-id={url.split('/video/')[1]?.split('?')[0]}>
          <a href={url}></a>
        </blockquote>
      </div>
    );
  }

  if (platform === 'youtube') {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split(/[?&]/)[0];
    } else if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    }
    return (
      <div className="w-full flex justify-center items-center">
        <iframe
          width="500"
          height="200"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
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